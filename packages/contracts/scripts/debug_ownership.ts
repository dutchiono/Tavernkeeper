
import { ethers } from "hardhat";

const ADDRESSES = {
    CELLAR_TOKEN: "0x6eF142a2203102F6c58b0C15006BF9F6F5CFe39E",
    THE_CELLAR: "0x32A920be00dfCE1105De0415ba1d4f06942E9ed0",
    NPM: "0x7197e214c0b767cfb76fb734ab638e2c192f4e53"
};

async function main() {
    const [runner] = await ethers.getSigners();
    console.log(`Checking Ownership and Existence...`);

    // 1. Check NPM Code
    const npmCode = await ethers.provider.getCode(ADDRESSES.NPM);
    console.log(`NPM Code Length: ${npmCode.length}`);
    if (npmCode === "0x") console.error("❌ NPM Code Missing!");
    else console.log("✅ NPM exists.");

    // 2. Check CellarToken Ownership
    const CellarToken = await ethers.getContractAt("OwnableUpgradeable", ADDRESSES.CELLAR_TOKEN); // or Ownable
    // Assuming Standard Ownable or OwnableUpgradeable
    // Need ABI with owner()

    // Using explicit ABI to be safe
    const token = new ethers.Contract(ADDRESSES.CELLAR_TOKEN, ["function owner() view returns (address)"], runner);

    try {
        const owner = await token.owner();
        console.log(`CellarToken Owner: ${owner}`);
        console.log(`TheCellarV3:     ${ADDRESSES.THE_CELLAR}`);

        if (owner.toLowerCase() === ADDRESSES.THE_CELLAR.toLowerCase()) {
            console.log("✅ CellarToken is owned by TheCellarV3.");
        } else {
            console.error("❌ CellarToken is NOT owned by TheCellarV3! Minting will fail.");
        }
    } catch (e) {
        console.error("Error reading owner:", e);
    }
}

main().catch(console.error);
