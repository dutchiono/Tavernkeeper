
import { ethers } from "hardhat";

const KEEP = "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E";

async function main() {
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    console.log(`Network: ${network.chainId}`);

    const code = await provider.getCode(KEEP);
    console.log(`Code at ${KEEP}: ${code.slice(0, 50)}...`);

    if (code === "0x") {
        console.error("❌ No code at KEEP address!");
    } else {
        console.log("✅ Code found.");
    }
}

main().catch(console.error);
