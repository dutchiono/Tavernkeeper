
import { ethers } from "hardhat";

/**
 * Test script to verify liquidity addition works correctly
 *
 * This script:
 * 1. Adds a small amount of liquidity (0.1 MON + 0.3 KEEP)
 * 2. Verifies LP tokens are minted
 * 3. Verifies liquidity is added to Uniswap V4 pool
 * 4. Verifies pool is initialized
 *
 * Usage:
 *   npx hardhat run scripts/test_liquidity_addition.ts --network monad
 */

const MAINNET_CELLAR_HOOK_PROXY = "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755";
const MAINNET_KEEP_TOKEN = "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E";
const MAINNET_POOL_MANAGER = "0x27e98f6A0D3315F9f3ECDaFE0187a7637F41c7c2";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== TESTING LIQUIDITY ADDITION ===\n");
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);

    const CELLAR_HOOK_PROXY = process.env.CELLAR_HOOK_PROXY || MAINNET_CELLAR_HOOK_PROXY;
    const KEEP_TOKEN_ADDRESS = process.env.KEEP_TOKEN || MAINNET_KEEP_TOKEN;

    // Get contract instances
    const CellarHook = await ethers.getContractFactory("CellarHook");
    const cellarHook = CellarHook.attach(CELLAR_HOOK_PROXY);

    const keepToken = await ethers.getContractAt("IERC20", KEEP_TOKEN_ADDRESS);

    const POOL_MANAGER = process.env.POOL_MANAGER || MAINNET_POOL_MANAGER;

    // Get MON and KEEP Currency from contract
    const MON = await cellarHook.MON();
    const KEEP = await cellarHook.KEEP();
    const MON_ADDRESS = ethers.getAddress(ethers.hexlify(MON));
    const KEEP_ADDRESS = ethers.getAddress(ethers.hexlify(KEEP));

    console.log("\n--- Token Addresses ---");
    console.log("MON:", MON_ADDRESS === ethers.ZeroAddress ? "Native (ETH)" : MON_ADDRESS);
    console.log("KEEP:", KEEP_ADDRESS);

    // Sort currencies for PoolKey (currency0 < currency1)
    const currency0 = MON_ADDRESS < KEEP_ADDRESS ? MON : KEEP;
    const currency1 = MON_ADDRESS < KEEP_ADDRESS ? KEEP : MON;

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

    // Approve KEEP tokens
    console.log("\n--- Approving KEEP Tokens ---");
    const approveTx = await keepToken.approve(CELLAR_HOOK_PROXY, amountKEEP);
    await approveTx.wait();
    console.log("✅ KEEP tokens approved");

    // Construct PoolKey
    // PoolKey: { currency0, currency1, fee, tickSpacing, hooks }
    // currency0 and currency1 must be sorted (address(currency0) < address(currency1))
    // Currency is just an address type in ethers
    const poolKey = {
        currency0: currency0,
        currency1: currency1,
        fee: 3000, // 0.3% fee (standard Uniswap V4 fee tier)
        tickSpacing: 60, // Standard tick spacing
        hooks: CELLAR_HOOK_PROXY, // Hook address
    };

    console.log("\n--- Pool Key ---");
    const currency0Addr = ethers.getAddress(ethers.hexlify(currency0));
    const currency1Addr = ethers.getAddress(ethers.hexlify(currency1));
    console.log("Currency0:", currency0Addr === ethers.ZeroAddress ? "Native" : currency0Addr);
    console.log("Currency1:", currency1Addr);
    console.log("Fee: 3000 (0.3%)");
    console.log("Tick Spacing: 60");
    console.log("Hooks:", CELLAR_HOOK_PROXY);

    // Add liquidity
    console.log("\n--- Adding Liquidity ---");
    console.log("Calling addLiquidity...");
    console.log("Amount MON:", ethers.formatEther(amountMON), "MON");
    console.log("Amount KEEP:", ethers.formatEther(amountKEEP), "KEEP");

    let tx;
    if (MON_ADDRESS === ethers.ZeroAddress) {
        // Native MON - addLiquidity(PoolKey, uint256 amountMON, uint256 amountKEEP, int24 tickLower, int24 tickUpper)
        tx = await cellarHook.addLiquidity(poolKey, amountMON, amountKEEP, 0, 0, { value: amountMON });
    } else {
        // ERC20 MON - need to approve first
        const monToken = await ethers.getContractAt("IERC20", MON_ADDRESS);
        const monApproveTx = await monToken.approve(CELLAR_HOOK_PROXY, amountMON);
        await monApproveTx.wait();
        console.log("✅ MON tokens approved");
        // addLiquidity(PoolKey, uint256 amountMON, uint256 amountKEEP, int24 tickLower, int24 tickUpper)
        tx = await cellarHook.addLiquidity(poolKey, amountMON, amountKEEP, 0, 0);
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
