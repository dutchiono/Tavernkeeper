
import { ethers } from "hardhat";

// Monad Mainnet Addresses
const ADDRESSES = {
    WMON: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A", // Verified
    KEEP: "0x2D1094F5CED6ba279962f9676d32BE092AFbf82E", // Verified
    THE_CELLAR: "0x32A920be00dfCE1105De0415ba1d4f06942E9ed0",
    CELLAR_TOKEN: "0x6eF142a2203102F6c58b0C15006BF9F6F5CFe39E"
};

async function main() {
    const [runner] = await ethers.getSigners();
    console.log(`Verifying V3 Interactions (Correct Addresses)...`);
    console.log(`Runner: ${runner.address}`);

    // Enhanced WMON ABI
    const WMON = await ethers.getContractAt([
        "function balanceOf(address) view returns (uint256)",
        "function approve(address, uint256) returns (bool)",
        "function deposit() payable",
        "function transfer(address, uint256) returns (bool)"
    ], ADDRESSES.WMON);

    const KEEP = await ethers.getContractAt("IERC20", ADDRESSES.KEEP);
    const CellarToken = await ethers.getContractAt("IERC20", ADDRESSES.CELLAR_TOKEN);
    const TheCellarV3 = await ethers.getContractAt("TheCellarV3", ADDRESSES.THE_CELLAR);

    // 1. Check Balances
    let balMON = await WMON.balanceOf(runner.address);
    const balKEEP = await KEEP.balanceOf(runner.address);

    console.log(`Balance WMON: ${ethers.formatEther(balMON)}`);
    console.log(`Balance KEEP: ${ethers.formatEther(balKEEP)}`);

    // Amount to Add: 0.1 WMON + 0.05 KEEP
    const addMON = ethers.parseEther("0.1");
    const addKEEP = ethers.parseEther("0.05");

    if (balMON < addMON) {
        console.log("⚠️  Low WMON Balance. Wrapping MON...");
        // Add minimal buffer
        const wrapAmount = addMON - balMON + ethers.parseEther("0.01");

        try {
            const txWrap = await WMON.deposit({ value: wrapAmount }); // Wrap MON
            await txWrap.wait();
            console.log(`✅ Wrapped ${ethers.formatEther(wrapAmount)} MON into WMON`);
        } catch (e) {
            console.error("❌ Failed to wrap MON. Insufficient MON balance?");
            throw e;
        }

        // Refresh balance
        balMON = await WMON.balanceOf(runner.address);
        console.log(`New Balance WMON: ${ethers.formatEther(balMON)}`);
    }

    if (balKEEP < addKEEP) {
        console.error("❌ Insufficient KEEP Balance! Cannot wrap KEEP automatically.");
        return;
    }

    // 2. Approve
    console.log("Approving...");
    await (await WMON.approve(ADDRESSES.THE_CELLAR, addMON)).wait();
    await (await KEEP.approve(ADDRESSES.THE_CELLAR, addKEEP)).wait();

    // 3. Add Liquidity
    console.log(`Adding Liquidity: ${ethers.formatEther(addMON)} WMON, ${ethers.formatEther(addKEEP)} KEEP...`);
    const txAdd = await TheCellarV3.addLiquidity(addMON, addKEEP);
    console.log(`Tx: ${txAdd.hash}`);
    const receiptAdd = await txAdd.wait();
    console.log("✅ Liquidity Added!");

    // 4. Check LP Balance
    const lpBal = await CellarToken.balanceOf(runner.address);
    console.log(`LP Balance (CLP): ${ethers.formatEther(lpBal)}`);

    if (lpBal === 0n) {
        console.error("❌ LP Balance is ZERO after adding liquidity!");
        return;
    }

    // 5. Withdraw Half
    const burnAmt = lpBal / 2n;
    console.log(`Withdrawing (Burning) ${ethers.formatEther(burnAmt)} CLP...`);

    await (await CellarToken.approve(ADDRESSES.THE_CELLAR, burnAmt)).wait();

    const txWith = await TheCellarV3.withdraw(burnAmt);
    console.log(`Tx: ${txWith.hash}`);
    await txWith.wait();
    console.log("✅ Withdrawn Half!");

    const finalLpBal = await CellarToken.balanceOf(runner.address);
    console.log(`Final LP Balance: ${ethers.formatEther(finalLpBal)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
