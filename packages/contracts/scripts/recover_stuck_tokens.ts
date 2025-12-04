import { ethers } from "hardhat";

/**
 * Recovery script for stuck tokens in CellarHook
 *
 * This script checks:
 * - Contract balances (MON and KEEP)
 * - Total LP token supply
 * - Users with LP tokens
 * - Calculates recovery amounts
 * - Guides recovery process
 *
 * Usage:
 *   npx hardhat run scripts/recover_stuck_tokens.ts --network monad
 *
 * Environment variables (optional):
 *   CELLAR_HOOK_PROXY=0x... (CellarHook proxy address)
 */

// Mainnet proxy address from FIRSTDEPLOYMENT.md
const MAINNET_CELLAR_HOOK_PROXY = "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755";

interface UserLPBalance {
    address: string;
    lpBalance: bigint;
    monRecoverable: bigint;
    keepRecoverable: bigint;
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== STUCK TOKEN RECOVERY ANALYSIS ===\n");
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

    // Get proxy address from env or use mainnet default
    const CELLAR_HOOK_PROXY = process.env.CELLAR_HOOK_PROXY || MAINNET_CELLAR_HOOK_PROXY;
    console.log("\nCellarHook Proxy:", CELLAR_HOOK_PROXY);

    // Get contract instances
    const CellarHook = await ethers.getContractFactory("CellarHook");
    const cellarHook = CellarHook.attach(CELLAR_HOOK_PROXY);

    // Get MON and KEEP addresses
    const MON = await cellarHook.MON();
    const KEEP = await cellarHook.KEEP();
    const MON_ADDRESS = ethers.getAddress(ethers.hexlify(MON));
    const KEEP_ADDRESS = ethers.getAddress(ethers.hexlify(KEEP));

    console.log("\n--- Token Addresses ---");
    console.log("MON:", MON_ADDRESS === ethers.ZeroAddress ? "Native (ETH)" : MON_ADDRESS);
    console.log("KEEP:", KEEP_ADDRESS);

    // Check pool initialization status (only available after upgrade)
    let poolInitialized = false;
    try {
        poolInitialized = await cellarHook.poolInitialized();
        console.log("\n--- Pool Status ---");
        console.log("Pool Initialized:", poolInitialized ? "✅ YES" : "❌ NO");
    } catch (error: any) {
        // Function doesn't exist in old version - assume not initialized
        console.log("\n--- Pool Status ---");
        console.log("⚠️  Note: Contract not yet upgraded - poolInitialized() not available");
        console.log("   Assuming pool is NOT initialized (recovery should be available)");
        poolInitialized = false;
    }

    if (poolInitialized) {
        console.log("\n⚠️  WARNING: Pool is already initialized!");
        console.log("   Recovery functions are disabled.");
        console.log("   Users cannot recover stuck tokens anymore.");
        console.log("   If tokens are still stuck, contact contract owner.");
        return;
    }

    // Check contract balances
    let contractMonBalance: bigint;
    let contractKeepBalance: bigint;

    if (MON_ADDRESS === ethers.ZeroAddress) {
        // Native MON
        contractMonBalance = await ethers.provider.getBalance(CELLAR_HOOK_PROXY);
    } else {
        // ERC20 MON
        const monToken = await ethers.getContractAt("IERC20", MON_ADDRESS);
        contractMonBalance = await monToken.balanceOf(CELLAR_HOOK_PROXY);
    }

    const keepToken = await ethers.getContractAt("IERC20", KEEP_ADDRESS);
    contractKeepBalance = await keepToken.balanceOf(CELLAR_HOOK_PROXY);

    console.log("\n--- Contract Balances ---");
    console.log("MON Balance:", ethers.formatEther(contractMonBalance), "MON");
    console.log("KEEP Balance:", ethers.formatEther(contractKeepBalance), "KEEP");

    // Check LP token supply
    const totalSupply = await cellarHook.totalSupply();
    console.log("\n--- LP Token Supply ---");
    console.log("Total LP Supply:", ethers.formatEther(totalSupply), "LP");

    // Calculate expected balances based on LP supply
    // 1 LP = 1 MON + 3 KEEP
    const expectedMon = totalSupply;
    const expectedKeep = totalSupply * 3n;

    console.log("\n--- Expected vs Actual ---");
    console.log("Expected MON (from LP supply):", ethers.formatEther(expectedMon), "MON");
    console.log("Expected KEEP (from LP supply):", ethers.formatEther(expectedKeep), "KEEP");
    console.log("Actual MON:", ethers.formatEther(contractMonBalance), "MON");
    console.log("Actual KEEP:", ethers.formatEther(contractKeepBalance), "KEEP");

    const monDiff = contractMonBalance >= expectedMon
        ? contractMonBalance - expectedMon
        : expectedMon - contractMonBalance;
    const keepDiff = contractKeepBalance >= expectedKeep
        ? contractKeepBalance - expectedKeep
        : expectedKeep - contractKeepBalance;

    if (contractMonBalance >= expectedMon && contractKeepBalance >= expectedKeep) {
        console.log("\n✅ Contract has sufficient tokens for full recovery");
    } else {
        console.log("\n⚠️  WARNING: Contract may not have enough tokens for full recovery");
        console.log("   MON difference:", ethers.formatEther(monDiff), "MON");
        console.log("   KEEP difference:", ethers.formatEther(keepDiff), "KEEP");
        console.log("   Some users may not be able to recover full amounts");
    }

    // Check deployer's LP balance
    const deployerLPBalance = await cellarHook.balanceOf(deployer.address);
    console.log("\n--- Deployer LP Balance ---");
    console.log("Your LP Balance:", ethers.formatEther(deployerLPBalance), "LP");

    if (deployerLPBalance > 0n) {
        const monRecoverable = deployerLPBalance;
        const keepRecoverable = deployerLPBalance * 3n;
        console.log("You can recover:", ethers.formatEther(monRecoverable), "MON +", ethers.formatEther(keepRecoverable), "KEEP");
    }

    // Try to find users with LP tokens (this is approximate - we'd need events to be accurate)
    console.log("\n--- Recovery Instructions ---");
    console.log("\nUsers with LP tokens can recover their tokens by calling:");
    console.log(`  cellarHook.recoverStuckTokens(lpTokenAmount)`);
    console.log("\nRecovery ratio: 1 LP token = 1 MON + 3 KEEP");

    if (deployerLPBalance > 0n) {
        console.log("\n--- Quick Recovery (for you) ---");
        console.log("Since you hold LP tokens, you can recover them after upgrade:");
        console.log(`  cellarHook.recoverStuckTokens(${deployerLPBalance.toString()})`);
        console.log(`  This will recover ${ethers.formatEther(monRecoverable)} MON + ${ethers.formatEther(keepRecoverable)} KEEP`);
    }

    console.log("\nExample (PowerShell):");
    console.log(`  $cellarHook = "0x${CELLAR_HOOK_PROXY.slice(2)}"`);
    console.log(`  $lpAmount = "1000000000000000000" # 1 LP token`);
    console.log(`  # Call recoverStuckTokens($lpAmount)`);

    console.log("\n--- Owner Recovery (if needed) ---");
    console.log("If users need help, owner can call:");
    console.log(`  cellarHook.recoverTokensForUser(userAddress, lpTokenAmount)`);
    console.log(`\nOwner address: ${await cellarHook.owner()}`);

    console.log("\n--- Important Notes ---");
    console.log("1. Recovery only works BEFORE pool is initialized");
    console.log("2. Once pool is initialized, recovery is permanently disabled");
    console.log("3. Users should recover their tokens before adding new liquidity");
    console.log("4. After recovery, users can add liquidity again to get valid LP tokens");

    console.log("\n=== Analysis Complete ===");
}

main().catch((error) => {
    console.error("❌ Recovery analysis failed:", error);
    process.exitCode = 1;
});
