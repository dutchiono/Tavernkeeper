import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy GoldToken
    const GoldToken = await ethers.getContractFactory("GoldToken");
    const goldToken = await GoldToken.deploy();
    await goldToken.waitForDeployment();
    console.log("GoldToken deployed to:", await goldToken.getAddress());

    // Deploy Inventory (with fee recipient)
    const feeRecipient = process.env.FEE_RECIPIENT_ADDRESS || deployer.address;
    const Inventory = await ethers.getContractFactory("Inventory");
    const inventory = await Inventory.deploy(feeRecipient);
    await inventory.waitForDeployment();
    console.log("Inventory deployed to:", await inventory.getAddress());
    console.log("Inventory fee recipient:", feeRecipient);

    // Deploy Adventurer
    const Adventurer = await ethers.getContractFactory("Adventurer");
    const adventurer = await Adventurer.deploy();
    await adventurer.waitForDeployment();
    console.log("Adventurer deployed to:", await adventurer.getAddress());

    // Deploy TavernKeeper
    const TavernKeeper = await ethers.getContractFactory("TavernKeeper");
    const tavernKeeper = await TavernKeeper.deploy();
    await tavernKeeper.waitForDeployment();
    console.log("TavernKeeper deployed to:", await tavernKeeper.getAddress());

    // Note: Pseudoswap contracts are expected to be already deployed or deployed separately
    // If we needed to deploy a mock Pseudoswap, we would do it here, but user requested no mocks.
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
