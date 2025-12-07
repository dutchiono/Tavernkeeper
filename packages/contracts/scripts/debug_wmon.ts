
import { ethers } from "hardhat";

const WMON = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";

async function main() {
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    console.log(`Network: ${network.chainId}`);

    const code = await provider.getCode(WMON);
    console.log(`Code at ${WMON}: ${code.slice(0, 50)}...`);

    if (code === "0x") {
        console.error("❌ No code at WMON address! Incorrect address or network?");
    } else {
        console.log("✅ Code found.");
    }
}

main().catch(console.error);
