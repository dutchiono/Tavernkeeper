
import { ethers, upgrades } from "hardhat";

// Monad Mainnet Addresses
const ADDRESSES = {
    THE_CELLAR_PROXY: "0x32A920be00dfCE1105De0415ba1d4f06942E9ed0",
    WMON: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A", // Verified WMON
    KEEP: "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E", // Verified KEEP
    V3_POSITION_MANAGER: "0x7197e214c0b767cfb76fb734ab638e2c192f4e53"
};

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Upgrading and Fixing TheCellarV3...`);
    console.log(`Deployer: ${deployer.address}`);

    // 1. Upgrade Proxy to new Implementation (with setConfig)
    const TheCellarV3 = await ethers.getContractFactory("TheCellarV3");

    console.log("Upgrading proxy...");
    const cellar = await upgrades.upgradeProxy(ADDRESSES.THE_CELLAR_PROXY, TheCellarV3);
    await cellar.waitForDeployment();
    console.log("✅ Proxy Upgraded!");

    // 2. Set Config
    console.log("Setting correct token addresses...");
    // We need to attach to the proxy address with the new interface
    // upgrades.upgradeProxy returns the contract instance, so we can use `cellar`

    // Check if setConfig exists on the instance (it might depend on how ethers/hardhat-upgrades typing works)
    // If not, we can re-attach
    const cellarFixed = TheCellarV3.attach(ADDRESSES.THE_CELLAR_PROXY);

    const tx = await cellarFixed.setConfig(ADDRESSES.WMON, ADDRESSES.KEEP);
    console.log(`Config Tx: ${tx.hash}`);
    await tx.wait();

    console.log("✅ Configuration Updated!");

    // Verify
    const wmon = await cellarFixed.wmon();
    const keep = await cellarFixed.keepToken();

    console.log(`Current WMON: ${wmon}`);
    console.log(`Current KEEP: ${keep}`);

    if (wmon === ADDRESSES.WMON && keep === ADDRESSES.KEEP) {
        console.log("SUCCESS: Addresses match!");
    } else {
        console.error("FAILURE: Addresses do not match!");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
