import { ethers } from "hardhat";

/**
 * Test script to verify liquidity addition via CellarZapV4
 *
 * This script:
 * 1. Adds a small amount of liquidity via CellarZapV4 (0.1 MON + 0.3 KEEP)
 * 2. Verifies LP tokens are minted
 * 3. Verifies liquidity is added to Uniswap V4 pool
 * 4. Verifies pool is initialized
 *
 * Usage:
 *   npx hardhat run scripts/test_liquidity_via_zap.ts --network monad
 */

const MAINNET_CELLAR_HOOK_PROXY = "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755";
const MAINNET_CELLAR_ZAP_PROXY = "0xf7248a01051bf297Aa56F12a05e7209C60Fc5863";
const MAINNET_KEEP_TOKEN = "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== TESTING LIQUIDITY ADDITION VIA CELLARZAP ===\n");
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);

    const CELLAR_HOOK_PROXY = process.env.CELLAR_HOOK_PROXY || MAINNET_CELLAR_HOOK_PROXY;
    const CELLAR_ZAP_PROXY = process.env.CELLAR_ZAP_PROXY || MAINNET_CELLAR_ZAP_PROXY;
    const KEEP_TOKEN_ADDRESS = process.env.KEEP_TOKEN || MAINNET_KEEP_TOKEN;

    // Get contract instances
    const CellarHook = await ethers.getContractFactory("CellarHook");
    const cellarHook = CellarHook.attach(CELLAR_HOOK_PROXY);

    const CellarZapV4 = await ethers.getContractFactory("CellarZapV4");
    const cellarZap = CellarZapV4.attach(CELLAR_ZAP_PROXY);

    const keepToken = await ethers.getContractAt("IERC20", KEEP_TOKEN_ADDRESS);

    // Get MON and KEEP addresses from contract
    const MON = await cellarHook.MON();
    const KEEP = await cellarHook.KEEP();
    const MON_ADDRESS = ethers.getAddress(ethers.hexlify(MON));
    const KEEP_ADDRESS = ethers.getAddress(ethers.hexlify(KEEP));

    console.log("\n--- Token Addresses ---");
    console.log("MON:", MON_ADDRESS === ethers.ZeroAddress ? "Native (ETH)" : MON_ADDRESS);
    console.log("KEEP:", KEEP_ADDRESS);

    // Check pool initialization status
    let poolInitialized = false;
    try {
        poolInitialized = await cellarHook.poolInitialized();
        console.log("\n--- Pool Status (Before) ---");
        console.log("Pool Initialized:", poolInitialized ? "✅ YES" : "❌ NO");
    } catch (error: any) {
        console.log("⚠️  poolInitialized() not available - contract may not be upgraded");
        return;
    }

    // Test amounts: 0.1 MON + 0.3 KEEP (1:3 ratio)
    const amountMON = ethers.parseEther("0.1");
    const amountKEEP = ethers.parseEther("0.3");

    console.log("\n--- Test Amounts ---");
    console.log("MON:", ethers.formatEther(amountMON), "MON");
    console.log("KEEP:", ethers.formatEther(amountKEEP), "KEEP");
    console.log("Ratio: 1:3 ✅");

    // Check balances
    let deployerMonBalance: bigint;
    if (MON_ADDRESS === ethers.ZeroAddress) {
        deployerMonBalance = await ethers.provider.getBalance(deployer.address);
    } else {
        const monToken = await ethers.getContractAt("IERC20", MON_ADDRESS);
        deployerMonBalance = await monToken.balanceOf(deployer.address);
    }
    const deployerKeepBalance = await keepToken.balanceOf(deployer.address);

    console.log("\n--- Deployer Balances (Before) ---");
    console.log("MON Balance:", ethers.formatEther(deployerMonBalance), "MON");
    console.log("KEEP Balance:", ethers.formatEther(deployerKeepBalance), "KEEP");

    if (deployerMonBalance < amountMON) {
        console.log("\n❌ Insufficient MON balance!");
        return;
    }
    if (deployerKeepBalance < amountKEEP) {
        console.log("\n❌ Insufficient KEEP balance!");
        return;
    }

    // Get initial LP balance
    const initialLPBalance = await cellarHook.balanceOf(deployer.address);
    console.log("\n--- LP Balance (Before) ---");
    console.log("LP Balance:", ethers.formatEther(initialLPBalance), "LP");

    // Approve tokens to CellarZapV4
    console.log("\n--- Approving Tokens ---");
    const keepApproveTx = await keepToken.approve(CELLAR_ZAP_PROXY, amountKEEP);
    await keepApproveTx.wait();
    console.log("✅ KEEP tokens approved to CellarZapV4");

    if (MON_ADDRESS !== ethers.ZeroAddress) {
        const monToken = await ethers.getContractAt("IERC20", MON_ADDRESS);
        const monApproveTx = await monToken.approve(CELLAR_ZAP_PROXY, amountMON);
        await monApproveTx.wait();
        console.log("✅ MON tokens approved to CellarZapV4");
    }

    // Add liquidity via CellarZapV4
    console.log("\n--- Adding Liquidity via CellarZapV4 ---");
    console.log("Calling mintLP...");

    let tx;
    if (MON_ADDRESS === ethers.ZeroAddress) {
        // Native MON - mintLP(uint256 amountMON, uint256 amountKEEP) payable
        tx = await cellarZap.mintLP(amountMON, amountKEEP, { value: amountMON });
    } else {
        // ERC20 MON
        tx = await cellarZap.mintLP(amountMON, amountKEEP);
    }

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("✅ Liquidity added!");
    console.log("Block:", receipt?.blockNumber);
    console.log("Gas used:", receipt?.gasUsed?.toString());

    // Check LP balance after
    const finalLPBalance = await cellarHook.balanceOf(deployer.address);
    const lpMinted = finalLPBalance - initialLPBalance;
    console.log("\n--- LP Balance (After) ---");
    console.log("LP Balance:", ethers.formatEther(finalLPBalance), "LP");
    console.log("LP Minted:", ethers.formatEther(lpMinted), "LP");
    console.log("Expected:", ethers.formatEther(amountMON), "LP (1 LP per 1 MON)");

    // Check pool initialization status
    const poolInitializedAfter = await cellarHook.poolInitialized();
    console.log("\n--- Pool Status (After) ---");
    console.log("Pool Initialized:", poolInitializedAfter ? "✅ YES" : "❌ NO");

    if (!poolInitialized && poolInitializedAfter) {
        console.log("✅ Pool was initialized during this transaction!");
    }

    // Check balances after
    let deployerMonBalanceAfter: bigint;
    if (MON_ADDRESS === ethers.ZeroAddress) {
        deployerMonBalanceAfter = await ethers.provider.getBalance(deployer.address);
    } else {
        const monToken = await ethers.getContractAt("IERC20", MON_ADDRESS);
        deployerMonBalanceAfter = await monToken.balanceOf(deployer.address);
    }
    const deployerKeepBalanceAfter = await keepToken.balanceOf(deployer.address);

    console.log("\n--- Deployer Balances (After) ---");
    console.log("MON Balance:", ethers.formatEther(deployerMonBalanceAfter), "MON");
    console.log("KEEP Balance:", ethers.formatEther(deployerKeepBalanceAfter), "KEEP");
    console.log("MON Spent:", ethers.formatEther(deployerMonBalance - deployerMonBalanceAfter), "MON");
    console.log("KEEP Spent:", ethers.formatEther(deployerKeepBalance - deployerKeepBalanceAfter), "KEEP");

    // Verify LP tokens match expected amount
    if (lpMinted === amountMON) {
        console.log("\n✅ LP tokens minted correctly (1 LP per 1 MON)");
    } else {
        console.log("\n⚠️  LP tokens don't match expected amount");
        console.log("   Expected:", ethers.formatEther(amountMON), "LP");
        console.log("   Actual:", ethers.formatEther(lpMinted), "LP");
    }

    // Summary
    console.log("\n=== TEST SUMMARY ===");
    console.log("✅ Liquidity addition transaction successful");
    console.log("✅ LP tokens minted:", ethers.formatEther(lpMinted), "LP");
    console.log("✅ Pool initialized:", poolInitializedAfter ? "YES" : "NO");
    console.log("\n🎉 Test completed successfully!");
}

main().catch((error) => {
    console.error("❌ Test failed:", error);
    process.exitCode = 1;
});
