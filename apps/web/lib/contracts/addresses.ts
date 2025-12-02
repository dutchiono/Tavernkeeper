import { Address } from 'viem';

/**
 * Address Configuration:
 * - DEPLOYER_ADDRESS: Wallet receiving team/dev fees (5% from TavernKeeper, owner tax from groups)
 * - FEE_RECIPIENT_ADDRESS: Wallet receiving Inventory contract fees (loot claiming)
 * - TREASURY_ADDRESS: Wallet receiving 5% from group manager fees (TavernRegulars/TownPosse)
 * - THE_CELLAR: CellarHook contract receiving 15% from TavernKeeper Office fees (pot)
 */

// Monad Testnet Addresses
const MONAD_ADDRESSES = {
    // Infrastructure
    ERC6551_REGISTRY: '0xca3f315D82cE6Eecc3b9E29Ecc8654BA61e7508C' as Address,
    ERC6551_IMPLEMENTATION: '0x9B5980110654dcA57a449e2D6BEc36fE54123B0F' as Address,

    // Game Contracts (Proxies)
    KEEP_TOKEN: '0x96982EC3625145f098DCe06aB34E99E7207b0520' as Address,
    INVENTORY: '0x2ABb5F58DE56948dD0E06606B88B43fFe86206c2' as Address,
    ADVENTURER: '0x4Fff2Ce5144989246186462337F0eE2C086F913E' as Address,
    TAVERNKEEPER: '0xFaC0786eF353583FBD43Ee7E7e84836c1857A381' as Address,
    DUNGEON_GATEKEEPER: '0x931Bf6DF5AC8d75b97Cb9cF0800F4C2831085c45' as Address,

    // Treasury / Mechanics
    THE_CELLAR: '0xA43034595E2d1c52Ab08a057B95dD38bCbFf87dC' as Address,
    CELLAR_ZAP: '0x8a2bA1Bc458c17dB722ce36EF015e33959eD167a' as Address,
    POOL_MANAGER: '0x8788E862023A49a77E8F27277a8b3F07B4E9A7d8' as Address,
    // Fee recipient from env (NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS), fallback to Cellar if not set
    FEE_RECIPIENT: (process.env.NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS as Address | undefined) || '0xaB837301d12cDc4b97f1E910FC56C9179894d9cf' as Address,

    // Group LP Management
    TAVERN_REGULARS_MANAGER: '0xE671CA8cDA72a70Ca4adb8BCfA03631FCfFe2cE8' as Address,
    TOWN_POSSE_MANAGER: '0xEa0F26c751b27504Df2D6D99Aa225e8f0D79Be58' as Address,
};

// Localhost Addresses (populated by deployment script)
export const LOCALHOST_ADDRESSES = {
    // Infrastructure
    ERC6551_REGISTRY: '0xca3f315D82cE6Eecc3b9E29Ecc8654BA61e7508C' as Address,
    ERC6551_IMPLEMENTATION: '0x9B5980110654dcA57a449e2D6BEc36fE54123B0F' as Address,

    // Game Contracts (Proxies) - FROM YOUR DEPLOYMENT OUTPUT
    KEEP_TOKEN: '0xc03bC9D0BD59b98535aEBD2102221AeD87c820A6' as Address,
    INVENTORY: '0xd8c9C56b1ef231207bAd219A488244aD34576F92' as Address,
    ADVENTURER: '0x3015864FDE2401cB23454BC7D7CA048649C0dEfa' as Address,
    TAVERNKEEPER: '0x193C700Ff3A554597907e4eA894d4040f38287b7' as Address,
    DUNGEON_GATEKEEPER: '0x931Bf6DF5AC8d75b97Cb9cF0800F4C2831085c45' as Address,

    // Treasury / Mechanics
    THE_CELLAR: '0xC1D9e381dF88841b16e9d01f35802B0583638e07' as Address,
    CELLAR_ZAP: '0x974Ac7F80FAAc9Eeaec3B2873A23333db29C87b0' as Address,
    POOL_MANAGER: '0x8788E862023A49a77E8F27277a8b3F07B4E9A7d8' as Address,
    // Fee recipient from env (NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS), fallback to Cellar if not set
    FEE_RECIPIENT: (process.env.NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS as Address | undefined) || '0xC1D9e381dF88841b16e9d01f35802B0583638e07' as Address,

    // Group LP Management
    TAVERN_REGULARS_MANAGER: '0xE671CA8cDA72a70Ca4adb8BCfA03631FCfFe2cE8' as Address,
    TOWN_POSSE_MANAGER: '0xEa0F26c751b27504Df2D6D99Aa225e8f0D79Be58' as Address,
};

// Choose addresses based on USE_LOCALHOST flag
const USE_LOCALHOST = process.env.NEXT_PUBLIC_USE_LOCALHOST === 'true';

// CONTRACT_ADDRESSES switches between Monad and Localhost
export const CONTRACT_ADDRESSES = USE_LOCALHOST ? LOCALHOST_ADDRESSES : MONAD_ADDRESSES;

// CRITICAL VALIDATION: Ensure no zero addresses in production
if (typeof window === 'undefined') {
    // Server-side validation
    for (const [key, address] of Object.entries(CONTRACT_ADDRESSES)) {
        if (address === '0x0000000000000000000000000000000000000000') {
            console.error(`🚨 CRITICAL ERROR: ${key} address is ZERO! This will break in production!`);
            console.error(`   USE_LOCALHOST=${USE_LOCALHOST}`);
            console.error(`   Set NEXT_PUBLIC_USE_LOCALHOST=true for localhost or ensure addresses are correct`);
        }
    }
}

// Implementation Addresses (for reference/verification)
export const IMPLEMENTATION_ADDRESSES = {
    KEEP_TOKEN: '0x96982EC3625145f098DCe06aB34E99E7207b0520' as Address,
    INVENTORY: '0x2ABb5F58DE56948dD0E06606B88B43fFe86206c2' as Address,
    ADVENTURER: '0x4Fff2Ce5144989246186462337F0eE2C086F913E' as Address,
    TAVERNKEEPER: '0xFaC0786eF353583FBD43Ee7E7e84836c1857A381' as Address,
    DUNGEON_GATEKEEPER: '0x9d394EAD99Acab4cF8e65cdA3c8e440fB7D27087' as Address,
    THE_CELLAR: '0xA43034595E2d1c52Ab08a057B95dD38bCbFf87dC' as Address, // CellarHook implementation
    CELLAR_ZAP: '0x8a2bA1Bc458c17dB722ce36EF015e33959eD167a' as Address, // CellarZapV4 implementation
};
