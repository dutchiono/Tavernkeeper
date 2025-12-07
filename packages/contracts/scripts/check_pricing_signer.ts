
import { ethers } from "hardhat";

// Monad Mainnet Addresses
const ADDRESSES = {
    TAVERN_KEEPER: "0x56B81A60Ae343342685911bd97D1331fF4fa2d29" // From DEPLOYMENT_TRACKER Mainnet
};

async function main() {
    const [runner] = await ethers.getSigners();
    console.log(`Checking TavernKeeper Pricing Signer...`);
    console.log(`Runner: ${runner.address}`);

    // Minimal ABI for signer
    const ABI = [
        "function signer() view returns (address)",
        "function owner() view returns (address)"
    ];

    const tk = new ethers.Contract(ADDRESSES.TAVERN_KEEPER, ABI, runner);

    try {
        const signer = await tk.signer();
        console.log(`Current Pricing Signer: ${signer}`);

        const owner = await tk.owner();
        console.log(`Contract Owner: ${owner}`);

        if (signer === ethers.ZeroAddress) {
            console.warn("⚠️  Pricing Signer is ZERO! Pricing unavailable.");
        } else if (signer === runner.address) {
            console.log("✅ Pricing Signer is the Deployer/Runner.");
        } else {
            console.log("ℹ️  Pricing Signer is a different address.");
        }

    } catch (e) {
        console.error("Error reading signer:", e);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
