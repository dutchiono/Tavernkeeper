import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const LP_STAKING_CONTRACT = process.env.LP_STAKING_CONTRACT || "";
const KEEP_STAKING_CONTRACT = process.env.KEEP_STAKING_CONTRACT || "";
const KEEP_TOKEN = process.env.KEEP_TOKEN || "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E";

const STAKING_ABI = [
    'function stakingToken() view returns (address)',
    'function rewardToken() view returns (address)',
    'function cellar() view returns (address)',
    'function totalWeightedStake() view returns (uint256)',
    'function getUserStake(address) view returns (tuple(uint256 amount, uint256 lockExpiry, uint256 lockMultiplier, uint256 rewardDebt))',
    'function getPendingRewards(address) view returns (uint256)',
];

const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
];

async function testStakingContract(address: string, name: string) {
    console.log(`\n📋 Testing ${name} (${address})...`);

    const [deployer] = await ethers.getSigners();
    const staking = new ethers.Contract(address, STAKING_ABI, deployer);

    try {
        // Check contract configuration
        const stakingToken = await staking.stakingToken();
        const rewardToken = await staking.rewardToken();
        const cellar = await staking.cellar();
        const totalWeightedStake = await staking.totalWeightedStake();

        console.log(`   ✅ Contract configuration:`);
        console.log(`      Staking Token: ${stakingToken}`);
        console.log(`      Reward Token: ${rewardToken}`);
        console.log(`      Cellar: ${cellar}`);
        console.log(`      Total Weighted Stake: ${ethers.formatEther(totalWeightedStake)}`);

        // Check token info
        const stakingTokenContract = new ethers.Contract(stakingToken, ERC20_ABI, deployer);
        const rewardTokenContract = new ethers.Contract(rewardToken, ERC20_ABI, deployer);

        try {
            const stakingSymbol = await stakingTokenContract.symbol();
            const rewardSymbol = await rewardTokenContract.symbol();
            console.log(`      Staking Token Symbol: ${stakingSymbol}`);
            console.log(`      Reward Token Symbol: ${rewardSymbol}`);
        } catch (e) {
            console.log(`      ⚠️  Could not read token symbols`);
        }

        // Check deployer's stake
        const userStake = await staking.getUserStake(deployer.address);
        const pendingRewards = await staking.getPendingRewards(deployer.address);

        console.log(`   ✅ Deployer's stake:`);
        console.log(`      Amount: ${ethers.formatEther(userStake.amount)}`);
        console.log(`      Lock Expiry: ${userStake.lockExpiry.toString() === "0" ? "No lock" : new Date(Number(userStake.lockExpiry) * 1000).toISOString()}`);
        console.log(`      Lock Multiplier: ${ethers.formatEther(userStake.lockMultiplier)}x`);
        console.log(`      Pending Rewards: ${ethers.formatEther(pendingRewards)}`);

        return true;
    } catch (error: any) {
        console.error(`   ❌ Test failed: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log("🧪 TESTING STAKING CONTRACTS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`Deployer: ${deployer.address}\n`);

    if (!LP_STAKING_CONTRACT && !KEEP_STAKING_CONTRACT) {
        console.error("❌ No staking contracts configured!");
        console.error("   Set LP_STAKING_CONTRACT and/or KEEP_STAKING_CONTRACT in .env");
        process.exit(1);
    }

    let allPassed = true;

    if (LP_STAKING_CONTRACT) {
        const passed = await testStakingContract(LP_STAKING_CONTRACT, "LPStaking");
        allPassed = allPassed && passed;
    } else {
        console.log("⚠️  LP_STAKING_CONTRACT not set, skipping...");
    }

    if (KEEP_STAKING_CONTRACT) {
        const passed = await testStakingContract(KEEP_STAKING_CONTRACT, "KEEPStaking");
        allPassed = allPassed && passed;
    } else {
        console.log("⚠️  KEEP_STAKING_CONTRACT not set, skipping...");
    }

    console.log("\n" + "=".repeat(60));
    if (allPassed) {
        console.log("✅ ALL TESTS PASSED!");
    } else {
        console.log("❌ SOME TESTS FAILED!");
        process.exitCode = 1;
    }
    console.log("=".repeat(60) + "\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

