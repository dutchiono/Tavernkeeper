import { ethers, upgrades } from "hardhat";
import { updateDeploymentTracker } from "./updateDeploymentTracker";
import { updateFrontendAddresses } from "./updateFrontend";

/**
 * Upgrade script for CellarHook and CellarZapV4 to fix Uniswap V4 liquidity implementation
 *
 * This upgrade implements:
 * - Actual poolManager.modifyLiquidity() call (was commented out)
 * - Pool initialization logic
 * - Proper liquidityDelta calculation
 * - BalanceDelta settlement using settle/take pattern
 * - Proper tick range handling
 *
 * Usage:
 *   npx hardhat run scripts/upgrade_liquidity_fix.ts --network monad
 *
 * Environment variables (optional, will use addresses from FIRSTDEPLOYMENT.md if not set):
 *   CELLAR_HOOK_PROXY=0x... (CellarHook proxy address)
 *   CELLAR_ZAP_PROXY=0x... (CellarZapV4 proxy address)
 */

// Mainnet proxy addresses from FIRSTDEPLOYMENT.md
const MAINNET_PROXIES = {
    CellarHook: "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755",
    CellarZapV4: "0xf7248a01051bf297Aa56F12a05e7209C60Fc5863", // From FIRSTDEPLOYMENT.md line 39
};

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== UPGRADING LIQUIDITY IMPLEMENTATION ===");
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

    // Get proxy addresses from env or use mainnet defaults
    const CELLAR_HOOK_PROXY = process.env.CELLAR_HOOK_PROXY || MAINNET_PROXIES.CellarHook;
    const CELLAR_ZAP_PROXY = process.env.CELLAR_ZAP_PROXY || MAINNET_PROXIES.CellarZapV4;

    console.log("\n--- Proxy Addresses ---");
    console.log("CellarHook Proxy:", CELLAR_HOOK_PROXY);
    console.log("CellarZapV4 Proxy:", CELLAR_ZAP_PROXY);

    // Verify proxies exist
    const hookCode = await ethers.provider.getCode(CELLAR_HOOK_PROXY);
    const zapCode = await ethers.provider.getCode(CELLAR_ZAP_PROXY);

    if (hookCode === "0x") {
        console.error("❌ CellarHook proxy not found at:", CELLAR_HOOK_PROXY);
        process.exit(1);
    }
    if (zapCode === "0x") {
        console.error("❌ CellarZapV4 proxy not found at:", CELLAR_ZAP_PROXY);
        process.exit(1);
    }

    // 1. Upgrade CellarHook
    console.log("\n--- Upgrading CellarHook ---");
    const CellarHookFactory = await ethers.getContractFactory("CellarHook");

    // Get current implementation
    const currentHookImpl = await upgrades.erc1967.getImplementationAddress(CELLAR_HOOK_PROXY);
    console.log("Current CellarHook Implementation:", currentHookImpl);

    // Upgrade proxy
    console.log("Deploying new implementation and upgrading proxy...");
    const cellarHook = await upgrades.upgradeProxy(CELLAR_HOOK_PROXY, CellarHookFactory);
    await cellarHook.waitForDeployment();

    const newHookImpl = await upgrades.erc1967.getImplementationAddress(CELLAR_HOOK_PROXY);
    console.log("✅ CellarHook Upgraded");
    console.log("   Proxy (unchanged):", CELLAR_HOOK_PROXY);
    console.log("   Old Implementation:", currentHookImpl);
    console.log("   New Implementation:", newHookImpl);

    // 2. Upgrade CellarZapV4
    console.log("\n--- Upgrading CellarZapV4 ---");
    const CellarZapFactory = await ethers.getContractFactory("CellarZapV4");

    // Get current implementation
    const currentZapImpl = await upgrades.erc1967.getImplementationAddress(CELLAR_ZAP_PROXY);
    console.log("Current CellarZapV4 Implementation:", currentZapImpl);

    // Upgrade proxy
    console.log("Deploying new implementation and upgrading proxy...");
    const cellarZap = await upgrades.upgradeProxy(CELLAR_ZAP_PROXY, CellarZapFactory);
    await cellarZap.waitForDeployment();

    const newZapImpl = await upgrades.erc1967.getImplementationAddress(CELLAR_ZAP_PROXY);
    console.log("✅ CellarZapV4 Upgraded");
    console.log("   Proxy (unchanged):", CELLAR_ZAP_PROXY);
    console.log("   Old Implementation:", currentZapImpl);
    console.log("   New Implementation:", newZapImpl);

    // 3. Update Frontend Addresses (implementation addresses)
    console.log("\n--- Updating Frontend Addresses ---");
    try {
        await updateFrontendAddresses({
            THE_CELLAR: CELLAR_HOOK_PROXY,
            THE_CELLAR_IMPL: newHookImpl,
            CELLAR_ZAP: CELLAR_ZAP_PROXY,
            CELLAR_ZAP_IMPL: newZapImpl
        });
        console.log("✅ Frontend addresses updated");
    } catch (error: any) {
        console.warn("⚠️  Warning: Could not update frontend addresses:", error.message);
        console.warn("   Please update apps/web/lib/contracts/addresses.ts manually:");
        console.warn(`   THE_CELLAR: ${newHookImpl}`);
        console.warn(`   CELLAR_ZAP: ${newZapImpl}`);
    }

    // 4. Update Deployment Tracker
    console.log("\n--- Updating Deployment Tracker ---");
    try {
        await updateDeploymentTracker({
            CELLAR_HOOK: CELLAR_HOOK_PROXY,
            CELLAR_ZAP: CELLAR_ZAP_PROXY
        });
        console.log("✅ Deployment tracker updated");
    } catch (error: any) {
        console.warn("⚠️  Warning: Could not update deployment tracker:", error.message);
    }

    // 5. Print summary and next steps
    console.log("\n============================================");
    console.log("UPGRADE COMPLETE");
    console.log("============================================");
    console.log("\nUpgraded Contracts:");
    console.log("1. CellarHook:");
    console.log(`   Proxy: ${CELLAR_HOOK_PROXY}`);
    console.log(`   Old Impl: ${currentHookImpl}`);
    console.log(`   New Impl: ${newHookImpl}`);
    console.log("\n2. CellarZapV4:");
    console.log(`   Proxy: ${CELLAR_ZAP_PROXY}`);
    console.log(`   Old Impl: ${currentZapImpl}`);
    console.log(`   New Impl: ${newZapImpl}`);

    console.log("\n=== DOCUMENTATION UPDATE REQUIRED ===");
    console.log("Run this command to update FIRSTDEPLOYMENT.md:");
    console.log(`\nFor CellarHook:`);
    console.log(`  $env:CONTRACT_NAME="CellarHook"; $env:OLD_IMPL="${currentHookImpl}"; $env:NEW_IMPL="${newHookImpl}"; $env:REASON="Fixed Uniswap V4 liquidity implementation - added modifyLiquidity call, pool initialization, BalanceDelta settlement"; npx hardhat run scripts/update_deployment_docs.ts`);
    console.log(`\nFor CellarZapV4:`);
    console.log(`  $env:CONTRACT_NAME="CellarZapV4"; $env:OLD_IMPL="${currentZapImpl}"; $env:NEW_IMPL="${newZapImpl}"; $env:REASON="Fixed Uniswap V4 liquidity implementation - updated comments"; npx hardhat run scripts/update_deployment_docs.ts`);

    console.log("\nOr manually update FIRSTDEPLOYMENT.md Upgrade History section with:");
    console.log(`  - CellarHook: Proxy ${CELLAR_HOOK_PROXY}, Old ${currentHookImpl}, New ${newHookImpl}`);
    console.log(`  - CellarZapV4: Proxy ${CELLAR_ZAP_PROXY}, Old ${currentZapImpl}, New ${newZapImpl}`);

    console.log("\n=== RECOVERY INSTRUCTIONS ===");
    console.log("⚠️  IMPORTANT: Users may have stuck tokens from previous addLiquidity() calls");
    console.log("\n1. Check for stuck tokens:");
    console.log("   npx hardhat run scripts/recover_stuck_tokens.ts --network monad");
    console.log("\n2. Users can recover tokens by calling:");
    console.log(`   cellarHook.recoverStuckTokens(lpTokenAmount)`);
    console.log("   Recovery ratio: 1 LP token = 1 MON + 3 KEEP");
    console.log("\n3. Recovery only works BEFORE pool is initialized");
    console.log("   Once first real liquidity is added, pool initializes and recovery is disabled");
    console.log("\n4. After recovery, users can add liquidity again to get valid LP tokens");

    console.log("\n=== NEXT STEPS ===");
    console.log("1. Check for stuck tokens: npx hardhat run scripts/recover_stuck_tokens.ts --network monad");
    console.log("2. Users recover stuck tokens (if any) before adding new liquidity");
    console.log("3. Verify upgrades on block explorer");
    console.log("4. Test liquidity addition on testnet/mainnet");
    console.log("5. Verify pools are actually created and tradeable");
    console.log("6. Update DEPLOYMENT_TRACKER.md with upgrade details");
    console.log("7. Test that LP tokens now represent real liquidity");
}

main().catch((error) => {
    console.error("❌ Upgrade failed:", error);
    process.exitCode = 1;
});
