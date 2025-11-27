import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import {
    ERC6551Registry,
    ERC6551Account,
    Adventurer,
    GoldToken,
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ERC-6551 Integration", function () {
    let registry: ERC6551Registry;
    let accountImpl: ERC6551Account;
    let adventurer: Adventurer;
    let goldToken: GoldToken;
    let owner: SignerWithAddress;
    let otherAccount: SignerWithAddress;

    beforeEach(async function () {
        [owner, otherAccount] = await ethers.getSigners();

        // Deploy Registry (not upgradeable)
        const RegistryFactory = await ethers.getContractFactory("ERC6551Registry");
        registry = await RegistryFactory.deploy();

        // Deploy Account Implementation (not upgradeable)
        const AccountFactory = await ethers.getContractFactory("ERC6551Account");
        accountImpl = await AccountFactory.deploy();

        // Deploy Adventurer NFT as UUPS proxy
        const AdventurerFactory = await ethers.getContractFactory("Adventurer");
        adventurer = await upgrades.deployProxy(AdventurerFactory, [], {
            kind: "uups",
            initializer: "initialize",
        }) as unknown as Adventurer;

        // Deploy GoldToken as UUPS proxy
        const GoldTokenFactory = await ethers.getContractFactory("GoldToken");
        goldToken = await upgrades.deployProxy(GoldTokenFactory, [], {
            kind: "uups",
            initializer: "initialize",
        }) as unknown as GoldToken;
    });

    it("Should create a TBA for an Adventurer", async function () {
        // Mint Adventurer to owner
        await adventurer.safeMint(owner.address, "uri");
        const tokenId = 0;

        // Calculate expected address
        const chainId = (await ethers.provider.getNetwork()).chainId;
        const salt = ethers.ZeroHash;
        const expectedAddress = await registry.account(
            await accountImpl.getAddress(),
            salt,
            chainId,
            await adventurer.getAddress(),
            tokenId
        );

        // Create Account
        const tx = await registry.createAccount(
            await accountImpl.getAddress(),
            salt,
            chainId,
            await adventurer.getAddress(),
            tokenId
        );
        await tx.wait();

        // Verify creation
        const code = await ethers.provider.getCode(expectedAddress);
        expect(code).to.not.equal("0x");
    });

    it("Should allow TBA to receive and transfer Gold", async function () {
        // Mint Adventurer
        await adventurer.safeMint(owner.address, "uri");
        const tokenId = 0;
        const chainId = (await ethers.provider.getNetwork()).chainId;
        const salt = ethers.ZeroHash;

        // Create TBA
        await registry.createAccount(
            await accountImpl.getAddress(),
            salt,
            chainId,
            await adventurer.getAddress(),
            tokenId
        );

        const tbaAddress = await registry.account(
            await accountImpl.getAddress(),
            salt,
            chainId,
            await adventurer.getAddress(),
            tokenId
        );

        // Mint Gold to TBA
        await goldToken.mint(tbaAddress, 100);
        expect(await goldToken.balanceOf(tbaAddress)).to.equal(100);

        // Execute transfer from TBA
        const transferData = goldToken.interface.encodeFunctionData("transfer", [
            otherAccount.address,
            50,
        ]);

        const tbaContract = await ethers.getContractAt("ERC6551Account", tbaAddress);

        await tbaContract.execute(await goldToken.getAddress(), 0, transferData, 0);

        expect(await goldToken.balanceOf(tbaAddress)).to.equal(50);
        expect(await goldToken.balanceOf(otherAccount.address)).to.equal(50);
    });
});
