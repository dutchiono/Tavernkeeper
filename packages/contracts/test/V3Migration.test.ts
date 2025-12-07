
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("TheCellarV3 Migration", function () {

    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        // 1. Deploy Mock Tokens (WMON, KEEP)
        const WETH = await ethers.getContractFactory("WETH9");
        const wmon = await WETH.deploy();

        // Simple Mock ERC20 for KEEP
        const MockToken = await ethers.getContractFactory("CellarToken");
        // Reusing CellarToken as a generic ERC20 for KEEP mock since it has mint/burn
        const keepToken = await MockToken.deploy();

        // 2. Deploy Mock PositionManager
        // We need a mock that implements INonfungiblePositionManager
        // For this test, we accept any call and return dummy values
        const MockPM = await ethers.getContractFactory("MockPositionManager");
        const positionManager = await MockPM.deploy();

        // 3. Deploy CellarToken (The LP Token)
        const CellarToken = await ethers.getContractFactory("CellarToken");
        const cellarToken = await CellarToken.deploy();

        // 4. Deploy TheCellarV3
        const TheCellarV3 = await ethers.getContractFactory("TheCellarV3");
        const cellar = await upgrades.deployProxy(TheCellarV3, [
            await positionManager.getAddress(),
            await cellarToken.getAddress(),
            await wmon.getAddress(),
            await keepToken.getAddress()
        ], { kind: 'uups' });

        // 5. Transfer Ownership of CellarToken
        await cellarToken.transferOwnership(await cellar.getAddress());

        return { cellar, cellarToken, wmon, keepToken, positionManager, owner, otherAccount };
    }

    // We need the MockPositionManager artifact. 
    // If it doesn't exist, we can't run this test yet.
    // I will create it in contracts/test/MockPositionManager.sol

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { cellar, owner } = await loadFixture(deployFixture);
            expect(await cellar.owner()).to.equal(owner.address);
        });

        it("Should have correct token addresses", async function () {
            const { cellar, wmon, keepToken } = await loadFixture(deployFixture);
            expect(await cellar.wmon()).to.equal(await wmon.getAddress());
            expect(await cellar.keepToken()).to.equal(await keepToken.getAddress());
        });
    });

    describe("Liquidity", function () {
        it("Should mint CLP when adding liquidity", async function () {
            const { cellar, cellarToken, wmon, keepToken, owner } = await loadFixture(deployFixture);

            // Mint WMON/KEEP to owner
            await wmon.deposit({ value: ethers.parseEther("10") });
            await keepToken.mint(owner.address, ethers.parseEther("100"));

            // Approve Cellar
            await wmon.approve(await cellar.getAddress(), ethers.parseEther("10"));
            await keepToken.approve(await cellar.getAddress(), ethers.parseEther("100"));

            // Add Liquidity
            await cellar.addLiquidity(ethers.parseEther("1"), ethers.parseEther("10"));

            // Check CLP balance
            // Our simple MockPM returns liquidity = 100 for any mint.
            // So we expect 100 CLP.
            const clpBalance = await cellarToken.balanceOf(owner.address);
            expect(clpBalance).to.be.gt(0);
        });

        it("Should burn CLP and recover principal when withdrawing", async function () {
            const { cellar, cellarToken, wmon, keepToken, owner } = await loadFixture(deployFixture);

            await wmon.deposit({ value: ethers.parseEther("10") });
            await keepToken.mint(owner.address, ethers.parseEther("100"));
            await wmon.approve(await cellar.getAddress(), ethers.parseEther("10"));
            await keepToken.approve(await cellar.getAddress(), ethers.parseEther("100"));
            await cellar.addLiquidity(ethers.parseEther("1"), ethers.parseEther("10"));

            const initialClp = await cellarToken.balanceOf(owner.address);

            await cellarToken.approve(await cellar.getAddress(), initialClp);

            await expect(cellar.withdraw(initialClp))
                .to.emit(cellar, 'LiquidityRemoved');

            expect(await cellarToken.balanceOf(owner.address)).to.equal(0);
        });

        it("Should burn CLP and claim fees when raiding", async function () {
            const { cellar, cellarToken, wmon, keepToken, owner } = await loadFixture(deployFixture);

            await wmon.deposit({ value: ethers.parseEther("10") });
            await keepToken.mint(owner.address, ethers.parseEther("100"));
            await wmon.approve(await cellar.getAddress(), ethers.parseEther("10"));
            await keepToken.approve(await cellar.getAddress(), ethers.parseEther("100"));
            await cellar.addLiquidity(ethers.parseEther("1"), ethers.parseEther("10"));

            const bid = ethers.parseEther("0.1");
            await cellarToken.approve(await cellar.getAddress(), bid);

            await expect(cellar.raid(bid))
                .to.emit(cellar, 'Raid');
        });
    });
});
