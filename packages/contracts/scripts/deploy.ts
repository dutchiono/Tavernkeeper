import { ethers, upgrades } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Get fee recipient from env or use deployer
    const feeRecipient = process.env.FEE_RECIPIENT_ADDRESS || deployer.address;
    console.log("Fee recipient:", feeRecipient);

    // Deploy ERC-6551 Registry (not upgradeable - infrastructure contract)
    console.log("\n=== Deploying ERC-6551 Registry ===");
    const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    const erc6551Registry = await ERC6551Registry.deploy();
    await erc6551Registry.waitForDeployment();
    const registryAddress = await erc6551Registry.getAddress();
    console.log("ERC6551Registry deployed to:", registryAddress);

    // Deploy ERC-6551 Account Implementation (not upgradeable - implementation contract)
    console.log("\n=== Deploying ERC-6551 Account Implementation ===");
    const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
    const erc6551Account = await ERC6551Account.deploy();
    await erc6551Account.waitForDeployment();
    const accountImplAddress = await erc6551Account.getAddress();
    console.log("ERC6551Account implementation deployed to:", accountImplAddress);

    // Deploy GoldToken as UUPS proxy
    console.log("\n=== Deploying GoldToken (UUPS Proxy) ===");
    const GoldToken = await ethers.getContractFactory("GoldToken");
    const goldTokenImpl = await upgrades.deployProxy(GoldToken, [], {
        kind: "uups",
        initializer: "initialize",
    });
    await goldTokenImpl.waitForDeployment();
    const goldTokenProxyAddress = await goldTokenImpl.getAddress();
    const goldTokenImplAddress = await upgrades.erc1967.getImplementationAddress(goldTokenProxyAddress);
    console.log("GoldToken proxy deployed to:", goldTokenProxyAddress);
    console.log("GoldToken implementation deployed to:", goldTokenImplAddress);

    // Deploy Inventory as UUPS proxy
    console.log("\n=== Deploying Inventory (UUPS Proxy) ===");
    const Inventory = await ethers.getContractFactory("Inventory");
    const inventory = await upgrades.deployProxy(Inventory, [feeRecipient], {
        kind: "uups",
        initializer: "initialize",
    });
    await inventory.waitForDeployment();
    const inventoryProxyAddress = await inventory.getAddress();
    const inventoryImplAddress = await upgrades.erc1967.getImplementationAddress(inventoryProxyAddress);
    console.log("Inventory proxy deployed to:", inventoryProxyAddress);
    console.log("Inventory implementation deployed to:", inventoryImplAddress);
    console.log("Inventory fee recipient:", feeRecipient);

    // Deploy Adventurer as UUPS proxy
    console.log("\n=== Deploying Adventurer (UUPS Proxy) ===");
    const Adventurer = await ethers.getContractFactory("Adventurer");
    const adventurer = await upgrades.deployProxy(Adventurer, [], {
        kind: "uups",
        initializer: "initialize",
    });
    await adventurer.waitForDeployment();
    const adventurerProxyAddress = await adventurer.getAddress();
    const adventurerImplAddress = await upgrades.erc1967.getImplementationAddress(adventurerProxyAddress);
    console.log("Adventurer proxy deployed to:", adventurerProxyAddress);
    console.log("Adventurer implementation deployed to:", adventurerImplAddress);

    // Deploy TavernKeeper as UUPS proxy
    console.log("\n=== Deploying TavernKeeper (UUPS Proxy) ===");
    const TavernKeeper = await ethers.getContractFactory("TavernKeeper");
    const tavernKeeper = await upgrades.deployProxy(TavernKeeper, [], {
        kind: "uups",
        initializer: "initialize",
    });
    await tavernKeeper.waitForDeployment();
    const tavernKeeperProxyAddress = await tavernKeeper.getAddress();
    const tavernKeeperImplAddress = await upgrades.erc1967.getImplementationAddress(tavernKeeperProxyAddress);
    console.log("TavernKeeper proxy deployed to:", tavernKeeperProxyAddress);
    console.log("TavernKeeper implementation deployed to:", tavernKeeperImplAddress);

    // Summary
    console.log("\n=== Deployment Summary ===");
    console.log("ERC6551Registry:", registryAddress);
    console.log("ERC6551Account Implementation:", accountImplAddress);
    console.log("GoldToken Proxy:", goldTokenProxyAddress);
    console.log("GoldToken Implementation:", goldTokenImplAddress);
    console.log("Inventory Proxy:", inventoryProxyAddress);
    console.log("Inventory Implementation:", inventoryImplAddress);
    console.log("Adventurer Proxy:", adventurerProxyAddress);
    console.log("Adventurer Implementation:", adventurerImplAddress);
    console.log("TavernKeeper Proxy:", tavernKeeperProxyAddress);
    console.log("TavernKeeper Implementation:", tavernKeeperImplAddress);

    console.log("\n=== IMPORTANT: Update DEPLOYMENT_TRACKER.md with these addresses ===");
    console.log("Also update .env files with proxy addresses (not implementation addresses)");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
