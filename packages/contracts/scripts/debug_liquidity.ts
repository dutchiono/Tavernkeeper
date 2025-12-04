import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Debugging Liquidity Addition...");

    const CELLAR_HOOK_PROXY = "0x6c7612F44B71E5E6E2bA0FEa799A23786A537755";
    const KEEP_TOKEN_ADDRESS = "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E";

    const CellarHook = await ethers.getContractFactory("CellarHook");
    const cellarHook = CellarHook.attach(CELLAR_HOOK_PROXY);
    const keepToken = await ethers.getContractAt("IERC20", KEEP_TOKEN_ADDRESS);

    const MON = await cellarHook.MON();
    const KEEP = await cellarHook.KEEP();
    const MON_ADDRESS = ethers.getAddress(ethers.hexlify(MON));
    const KEEP_ADDRESS = ethers.getAddress(ethers.hexlify(KEEP));

    const currency0 = MON_ADDRESS < KEEP_ADDRESS ? MON : KEEP;
    const currency1 = MON_ADDRESS < KEEP_ADDRESS ? KEEP : MON;

    const poolKey = {
        currency0: currency0,
        currency1: currency1,
        fee: 3000,
        tickSpacing: 60,
        hooks: CELLAR_HOOK_PROXY,
    };

    const amountMON = ethers.parseEther("0.1");
    const amountKEEP = ethers.parseEther("0.3");

    // Approve
    await (await keepToken.approve(CELLAR_HOOK_PROXY, amountKEEP)).wait();

    console.log("Simulating addLiquidity...");
    try {
        await cellarHook.addLiquidity.staticCall(poolKey, amountMON, amountKEEP, 0, 0, { value: amountMON });
        console.log("Simulation successful!");
    } catch (error: any) {
        console.log("Simulation failed!");
        if (error.reason) console.log("Reason:", error.reason);
        if (error.data) console.log("Data:", error.data);
        if (error.message) console.log("Message:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
