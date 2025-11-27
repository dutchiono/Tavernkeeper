import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { GoldToken, Inventory, Adventurer, TavernKeeper } from "../typechain-types";

describe("InnKeeper Contracts", function () {
    let goldToken: GoldToken;
    let inventory: Inventory;
    let adventurer: Adventurer;
    let tavernKeeper: TavernKeeper;
    let owner: any;
    let otherAccount: any;

    beforeEach(async function () {
        [owner, otherAccount] = await ethers.getSigners();

        // Deploy as UUPS proxies
        const GoldTokenFactory = await ethers.getContractFactory("GoldToken");
        goldToken = await upgrades.deployProxy(GoldTokenFactory, [], {
            kind: "uups",
            initializer: "initialize",
        }) as unknown as GoldToken;

        const InventoryFactory = await ethers.getContractFactory("Inventory");
        inventory = await upgrades.deployProxy(InventoryFactory, [owner.address], {
            kind: "uups",
            initializer: "initialize",
        }) as unknown as Inventory;

        const AdventurerFactory = await ethers.getContractFactory("Adventurer");
        adventurer = await upgrades.deployProxy(AdventurerFactory, [], {
            kind: "uups",
            initializer: "initialize",
        }) as unknown as Adventurer;

        const TavernKeeperFactory = await ethers.getContractFactory("TavernKeeper");
        tavernKeeper = await upgrades.deployProxy(TavernKeeperFactory, [], {
            kind: "uups",
            initializer: "initialize",
        }) as unknown as TavernKeeper;
    });

    describe("GoldToken", function () {
        it("Should mint initial supply to owner", async function () {
            const balance = await goldToken.balanceOf(owner.address);
            expect(balance).to.equal(ethers.parseUnits("1000000", 18));
        });

        it("Should allow owner to mint", async function () {
            await goldToken.mint(otherAccount.address, ethers.parseUnits("100", 18));
            expect(await goldToken.balanceOf(otherAccount.address)).to.equal(ethers.parseUnits("100", 18));
        });

        it("Should allow owner to burn", async function () {
            await goldToken.burn(owner.address, ethers.parseUnits("100", 18));
            expect(await goldToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("999900", 18));
        });
    });

    describe("Inventory", function () {
        it("Should allow owner to mint items", async function () {
            await inventory.mint(otherAccount.address, 1, 10, "0x");
            expect(await inventory.balanceOf(otherAccount.address, 1)).to.equal(10);
        });

        it("Should allow owner to set URI", async function () {
            await inventory.setURI("https://example.com/item/{id}.json");
            expect(await inventory.uri(1)).to.equal("https://example.com/item/{id}.json");
        });

        it("Should have fee recipient set", async function () {
            const feeRecipient = await inventory.feeRecipient();
            expect(feeRecipient).to.equal(owner.address);
        });
    });

    describe("Adventurer", function () {
        it("Should allow owner to mint adventurer", async function () {
            await adventurer.safeMint(otherAccount.address, "https://example.com/adventurer/1");
            expect(await adventurer.ownerOf(0)).to.equal(otherAccount.address);
            expect(await adventurer.tokenURI(0)).to.equal("https://example.com/adventurer/1");
        });
    });

    describe("TavernKeeper", function () {
        it("Should allow owner to mint tavern keeper", async function () {
            await tavernKeeper.safeMint(otherAccount.address, "https://example.com/keeper/1");
            expect(await tavernKeeper.ownerOf(0)).to.equal(otherAccount.address);
            expect(await tavernKeeper.tokenURI(0)).to.equal("https://example.com/keeper/1");
        });
    });
});
