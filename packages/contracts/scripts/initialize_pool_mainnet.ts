
import { ethers } from "hardhat";

/**
 * INITIALIZE POOL SCRIPT (MAINNET)
 * 
 * Usage:
 * npx hardhat run scripts/initialize_pool_mainnet.ts --network monad
 */

const MAINNET_ADDRESSES = {
    POOL_MANAGER: "0x27e98f6A0D3315F9f3ECDaFE0187a7637F41c7c2",
    KEEP_TOKEN: "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E",
    THE_CELLAR: "0xe71CAf7162dd81a4A9C0c6BD25ED02C26F492DC0", // Verified v2 Hook
};

const POOL_PARAMS = {
    FEE: 10000,          // 1.0%
    TICK_SPACING: 200    // 200 ticks
};

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("=== INITIALIZING POOL ON MAINNET ===");
    console.log("Deployer:", deployer.address);
    // console.log("Account balance:", (await deployer.getBalance()).toString()); // ethers v5
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // 1. Setup Contracts
    const cellarHook = await ethers.getContractAt("CellarHook", MAINNET_ADDRESSES.THE_CELLAR);
    const keepToken = await ethers.getContractAt("IERC20", MAINNET_ADDRESSES.KEEP_TOKEN);

    // 2. Define PoolKey
    const currency0 = ethers.ZeroAddress; // MON
    const currency1 = MAINNET_ADDRESSES.KEEP_TOKEN;

    // Sort currencies (though MON is native so it's always token0 if token1 is an address)
    // token0 < token1 is required, address(0) is always < any address

    const poolKey = {
        currency0: currency0,
        currency1: currency1,
        fee: POOL_PARAMS.FEE,
        tickSpacing: POOL_PARAMS.TICK_SPACING,
        hooks: MAINNET_ADDRESSES.THE_CELLAR
    };

    console.log("Pool Key:", poolKey);

    // 3. Initialize Pool
    console.log("\n--- Initializing Pool ---");
    try {
        const tx = await cellarHook.initializePool(poolKey);
        console.log("Tx sent:", tx.hash);
        await tx.wait();
        console.log("✅ Pool Initialized!");
    } catch (error: any) {
        console.warn(`⚠️  Initialization skipped/failed: ${error.message}`);
        // Likely already initialized or revert
    }

    // 4. Add Liquidity
    console.log("\n--- Adding Liquidity ---");
    const amountMON = ethers.parseEther("0.1");
    const amountKEEP = ethers.parseEther("0.3"); // 1:3 ratio

    console.log("Approving KEEP...");
    try {
        const approveTx = await keepToken.approve(MAINNET_ADDRESSES.THE_CELLAR, amountKEEP);
        await approveTx.wait();
        console.log("✅ KEEP Approved");
    } catch (e: any) {
        console.error("Approval failed:", e.message);
        return;
    }

    console.log("Calling addLiquidity...");
    try {
        const tx = await cellarHook.addLiquidity(
            poolKey,
            amountMON,
            amountKEEP,
            0, // tickLower (auto)
            0, // tickUpper (auto)
            { value: amountMON }
        );
        console.log("Tx sent:", tx.hash);
        await tx.wait();
        console.log("✅ Liquidity Added Successfully!");
    } catch (error: any) {
        console.error("❌ Add Liquidity Failed:", error.message);
        if (error.data) {
            // Try to decode if possible
            console.error("Error Data:", error.data);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
