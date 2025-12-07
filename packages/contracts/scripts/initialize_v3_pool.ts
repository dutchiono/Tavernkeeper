
import { ethers } from "hardhat";
import { BigNumber } from "ethers"; // V5? Hardhat uses Ethers v6 usually now? Check package.json if needed. Ethers v6 uses BigInt natively.

// Helper to calculate SqrtPriceX96
// price = amount1 / amount0
function encodeSqrtRatioX96(amount1: number, amount0: number): bigint {
    const numerator = BigInt(amount1);
    const denominator = BigInt(amount0);
    const ratio = (numerator << 192n) / denominator;
    return sqrt(ratio);
}

function sqrt(value: bigint): bigint {
    if (value < 0n) throw new Error("negative number");
    if (value < 2n) return value;
    let x = value;
    let y = (x + 1n) / 2n;
    while (y < x) {
        x = y;
        y = (value / x + x) / 2n;
    }
    return x;
}

// Monad Mainnet Addresses
const ADDRESSES = {
    WMON: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    KEEP: "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E",
    V3_POSITION_MANAGER: "0x7197e214c0b767cfb76fb734ab638e2c192f4e53"
};

const POOL_FEE = 10000; // 1%

// ABI
const PM_ABI = [
    "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external payable returns (address pool)"
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Initializing V3 Pool...`);
    console.log(`Deployer: ${deployer.address}`);

    // Sort Tokens
    // Token0 must be < Token1
    const token0 = ADDRESSES.KEEP.toLowerCase() < ADDRESSES.WMON.toLowerCase() ? ADDRESSES.KEEP : ADDRESSES.WMON;
    const token1 = ADDRESSES.KEEP.toLowerCase() < ADDRESSES.WMON.toLowerCase() ? ADDRESSES.WMON : ADDRESSES.KEEP;

    console.log(`Token0: ${token0} (${token0 === ADDRESSES.KEEP ? "KEEP" : "WMON"})`);
    console.log(`Token1: ${token1} (${token1 === ADDRESSES.KEEP ? "KEEP" : "WMON"})`);

    // Price Target: 1 KEEP = 3 MON.
    // If Token0 = KEEP, Token1 = WMON.
    // Price = Token1 / Token0 = 3 / 1 = 3.
    // encodeSqrtRatioX96(3, 1).
    let sqrtPriceX96;
    if (token0 === ADDRESSES.KEEP) {
        console.log("Configuration: KEEP is Token0. Price = 3 WMON / 1 KEEP.");
        sqrtPriceX96 = encodeSqrtRatioX96(3, 1);
    } else {
        console.log("Configuration: WMON is Token0. Price = 0.33 KEEP / 1 WMON.");
        sqrtPriceX96 = encodeSqrtRatioX96(1, 3);
    }

    console.log(`Calculated SqrtPriceX96: ${sqrtPriceX96.toString()}`);

    const pm = new ethers.Contract(ADDRESSES.V3_POSITION_MANAGER, PM_ABI, deployer);

    const tx = await pm.createAndInitializePoolIfNecessary(
        token0,
        token1,
        POOL_FEE,
        sqrtPriceX96
    );

    console.log(`Transaction submitted: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Pool Initialized!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
