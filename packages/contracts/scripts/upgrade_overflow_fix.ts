import { ethers, upgrades } from "hardhat";
import { updateDeploymentTracker } from "./updateDeploymentTracker";
import { updateFrontendAddresses } from "./updateFrontend";

/**
 * Upgrade script for CellarHook to fix overflow bug
 *
 * This upgrade implements:
 * - Fix for tick range calculation in addLiquidity (prevents overflow)
 * - Uses reasonable ±20000 tick range around current price
 *
 * Usage:
 *   npx hardhat run scripts/upgrade_overflow_fix.ts --network monad
 *
 * Environment variables (optional, will use addresses from FIRSTDEPLOYMENT.md if not set):
 *   CELLAR_HOOK_PROXY=0x... (CellarHook proxy address)
 */

// Mainnet proxy addresses from FIRSTDEPLOYMENT.md
const MAINNET_PROXIES = {
    CellarHook: "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755",
    // CellarZapV4 not needed for this upgrade
};

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== UPGRADING CELLAR HOOK (OVERFLOW FIX) ===");
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

    // Get proxy addresses from env or use mainnet defaults
    const CELLAR_HOOK_PROXY = process.env.CELLAR_HOOK_PROXY || MAINNET_PROXIES.CellarHook;

    console.log("\n--- Proxy Address ---");
    console.log("CellarHook Proxy:", CELLAR_HOOK_PROXY);

    // Verify proxy exists
    const hookCode = await ethers.provider.getCode(CELLAR_HOOK_PROXY);

    if (hookCode === "0x") {
        console.error("❌ CellarHook proxy not found at:", CELLAR_HOOK_PROXY);
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

    // 2. Update Frontend Addresses (implementation addresses)
    console.log("\n--- Updating Frontend Addresses ---");
    try {
        // We only have the new hook impl, we need to fetch the existing Zap proxy/impl to keep them in the file
        // Or we can just pass what we have and let the utility handle it (if it supports partial updates)
        // Looking at updateFrontend.ts, it seems to expect all or nothing usually, but let's see.
        // To be safe, let's try to read the existing Zap address from the file or just pass undefined for what we don't know if the function supports it.
        // However, updateFrontendAddresses usually writes the whole file.
        // Let's assume we should keep the existing Zap addresses as is.
        // We can fetch the Zap proxy from the hardcoded list above, and its impl from the chain.

        const CELLAR_ZAP_PROXY = "0xf7248a01051bf297Aa56F12a05e7209C60Fc5863"; // Hardcoded from previous script
        const zapImpl = await upgrades.erc1967.getImplementationAddress(CELLAR_ZAP_PROXY);

        await updateFrontendAddresses({
            THE_CELLAR: CELLAR_HOOK_PROXY,
            THE_CELLAR_IMPL: newHookImpl,
            CELLAR_ZAP: CELLAR_ZAP_PROXY,
            CELLAR_ZAP_IMPL: zapImpl
        });
        console.log("✅ Frontend addresses updated");
    } catch (error: any) {
        console.warn("⚠️  Warning: Could not update frontend addresses:", error.message);
        console.warn("   Please update apps/web/lib/contracts/addresses.ts manually:");
        console.warn(`   THE_CELLAR: ${newHookImpl}`);
    }

    // 3. Update Deployment Tracker
    console.log("\n--- Updating Deployment Tracker ---");
    try {
        await updateDeploymentTracker({
            CELLAR_HOOK: CELLAR_HOOK_PROXY,
            // We don't need to update Zap in the tracker if it hasn't changed, 
            // but the tracker might expect both. Let's pass what we have.
            CELLAR_ZAP: "0xf7248a01051bf297Aa56F12a05e7209C60Fc5863"
        });
        console.log("✅ Deployment tracker updated");
    } catch (error: any) {
        console.warn("⚠️  Warning: Could not update deployment tracker:", error.message);
    }

    // 4. Print summary and next steps
    console.log("\n============================================");
    console.log("UPGRADE COMPLETE");
    console.log("============================================");
    console.log("\nUpgraded Contracts:");
    console.log("1. CellarHook:");
    console.log(`   Proxy: ${CELLAR_HOOK_PROXY}`);
    console.log(`   Old Impl: ${currentHookImpl}`);
    console.log(`   New Impl: ${newHookImpl}`);

    console.log("\n=== NEXT STEPS ===");
    console.log("1. Verify upgrade on block explorer: npx hardhat verify --network monad " + newHookImpl);
    console.log("2. Test liquidity addition: npx hardhat run scripts/test_liquidity_addition.ts --network monad");
    console.log("3. Re-enable frontend components (CellarView, BottomNav, TheOfficeView)");
}

main().catch((error) => {
    console.error("❌ Upgrade failed:", error);
    process.exitCode = 1;
});
