import { ethers } from "hardhat";

/**
 * Simple script to recover stuck tokens for the deployer
 *
 * Usage:
 *   npx hardhat run scripts/recover_my_tokens.ts --network monad
 *
 * This will recover all LP tokens held by the deployer address
 */

const MAINNET_CELLAR_HOOK_PROXY = "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== RECOVER MY STUCK TOKENS ===\n");
    console.log("Deployer:", deployer.address);

    const CELLAR_HOOK_PROXY = process.env.CELLAR_HOOK_PROXY || MAINNET_CELLAR_HOOK_PROXY;

    // Get contract instance
    const CellarHook = await ethers.getContractFactory("CellarHook");
    const cellarHook = CellarHook.attach(CELLAR_HOOK_PROXY);

    // Check LP balance
    const lpBalance = await cellarHook.balanceOf(deployer.address);
    console.log("Your LP Balance:", ethers.formatEther(lpBalance), "LP");

    if (lpBalance === 0n) {
        console.log("\n✅ No LP tokens to recover!");
        return;
    }

    // Check pool initialization status
    let poolInitialized = false;
    try {
        poolInitialized = await cellarHook.poolInitialized();
    } catch (error: any) {
        console.log("⚠️  Contract not upgraded yet - recovery functions not available");
        console.log("   Please upgrade the contract first!");
        return;
    }

    if (poolInitialized) {
        console.log("\n❌ Pool is already initialized!");
        console.log("   Recovery is disabled. Tokens cannot be recovered.");
        return;
    }

    // Calculate recovery amounts
    const monRecoverable = lpBalance;
    const keepRecoverable = lpBalance * 3n;

    console.log("\n--- Recovery Details ---");
    console.log("LP Tokens to recover:", ethers.formatEther(lpBalance), "LP");
    console.log("Will recover:", ethers.formatEther(monRecoverable), "MON");
    console.log("Will recover:", ethers.formatEther(keepRecoverable), "KEEP");

    // Confirm recovery
    console.log("\n--- Executing Recovery ---");
    console.log("Calling recoverStuckTokens...");

    const tx = await cellarHook.recoverStuckTokens(lpBalance);
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Recovery successful!");
    console.log("Block:", receipt?.blockNumber);
    console.log("Gas used:", receipt?.gasUsed?.toString());

    // Verify balances
    const newLPBalance = await cellarHook.balanceOf(deployer.address);
    console.log("\n--- Verification ---");
    console.log("Remaining LP Balance:", ethers.formatEther(newLPBalance), "LP");

    if (newLPBalance === 0n) {
        console.log("✅ All LP tokens recovered!");
    } else {
        console.log("⚠️  Some LP tokens remain - you may need to recover again");
    }
}

main().catch((error) => {
    console.error("❌ Recovery failed:", error);
    process.exitCode = 1;
});
