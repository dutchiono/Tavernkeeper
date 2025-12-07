
import { ethers } from "hardhat";

// Monad Mainnet Addresses
const ADDRESSES = {
    WMON: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    KEEP: "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E",
    V3_FACTORY: "0x204faca1764b154221e35c0d20abb3c525710498", // Verified from search
    THE_CELLAR: "0x32A920be00dfCE1105De0415ba1d4f06942E9ed0"
};

const POOL_FEE = 10000; // 1%

// Minimal ABI
const FACTORY_ABI = [
    "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
];

const POOL_ABI = [
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    "function liquidity() external view returns (uint128)"
];

const CELLAR_ABI = [
    "function tokenId() external view returns (uint256)",
    "function potBalanceMON() external view returns (uint256)",
    "function potBalanceKEEP() external view returns (uint256)"
];

async function main() {
    const [runner] = await ethers.getSigners();
    console.log(`Checking V3 Pool on Monad Mainnet...`);
    console.log(`Runner: ${runner.address}`);

    const factory = new ethers.Contract(ADDRESSES.V3_FACTORY, FACTORY_ABI, runner);

    // 1. Check Pool Address
    const poolAddress = await factory.getPool(ADDRESSES.WMON, ADDRESSES.KEEP, POOL_FEE);
    console.log(`Pool (WMON/KEEP ${POOL_FEE}): ${poolAddress}`);

    if (poolAddress === ethers.ZeroAddress) {
        console.error("❌ Pool does NOT exist. Needs initialization.");
        return;
    }

    // 2. Check Pool State
    const pool = new ethers.Contract(poolAddress, POOL_ABI, runner);
    try {
        const slot0 = await pool.slot0();
        const liquidity = await pool.liquidity();

        console.log(`✅ Pool Initialized!`);
        console.log(`   SqrtPriceX96: ${slot0.sqrtPriceX96.toString()}`);
        console.log(`   Tick: ${slot0.tick.toString()}`);
        console.log(`   Liquidity: ${liquidity.toString()}`);

        if (liquidity === 0n) {
            console.warn("⚠️  Pool exists but has ZERO liquidity.");
        }

    } catch (e) {
        console.error("Error reading pool state:", e);
    }

    // 3. Check Cellar Contract State
    const cellar = new ethers.Contract(ADDRESSES.THE_CELLAR, CELLAR_ABI, runner);
    try {
        const tokenId = await cellar.tokenId();
        const potMON = await cellar.potBalanceMON();
        const potKEEP = await cellar.potBalanceKEEP();

        console.log(`TheCellarV3 State:`);
        console.log(`   Managed Token ID: ${tokenId.toString()}`);
        console.log(`   Pot Balance MON: ${ethers.formatEther(potMON)}`);
        console.log(`   Pot Balance KEEP: ${ethers.formatEther(potKEEP)}`);

        if (tokenId === 0n) {
            console.log("ℹ️  Cellar has not minted a position yet (Token ID is 0).");
        } else {
            console.log("✅ Cellar manages an active position.");
        }

    } catch (e) {
        console.error("Error reading cellar state:", e);
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
