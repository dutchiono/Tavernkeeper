
import { createPublicClient, createWalletClient, http, formatEther, parseEther, defineChain, custom, keccak256, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Define Localhost Chain
const localnet = defineChain({
    id: 31337,
    name: 'Localhost',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
    },
});

// Address from logs/config
const TAVERN_KEEPER_ADDRESS = '0x193C700Ff3A554597907e4eA894d4040f38287b7';
const KEEP_TOKEN_ADDRESS = '0xc03bC9D0BD59b98535aEBD2102221AeD87c820A6'; // From addresses.ts (Localhost)

// Use a known private key from Anvil/Hardhat (Account #0)
const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const MINTER_ROLE = keccak256(toBytes('MINTER_ROLE'));

const ABI = [
    {
        inputs: [
            { name: 'role', type: 'bytes32' },
            { name: 'account', type: 'address' },
        ],
        name: 'hasRole',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'role', type: 'bytes32' },
            { name: 'account', type: 'address' },
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    }
] as const;

async function main() {
    const account = privateKeyToAccount(TEST_PRIVATE_KEY);

    const client = createPublicClient({
        chain: localnet,
        transport: http(),
    });

    const walletClient = createWalletClient({
        account,
        chain: localnet,
        transport: http(),
    });

    console.log(`Checking Minter Role for TavernKeeper (${TAVERN_KEEPER_ADDRESS}) on KeepToken (${KEEP_TOKEN_ADDRESS})`);

    try {
        const hasMinterRole = await client.readContract({
            address: KEEP_TOKEN_ADDRESS,
            abi: ABI,
            functionName: 'hasRole',
            args: [MINTER_ROLE, TAVERN_KEEPER_ADDRESS],
        });

        console.log('Has Minter Role:', hasMinterRole);

        if (!hasMinterRole) {
            console.log('TavernKeeper missing MINTER_ROLE! Granting...');

            const hash = await walletClient.writeContract({
                address: KEEP_TOKEN_ADDRESS,
                abi: ABI,
                functionName: 'grantRole',
                args: [MINTER_ROLE, TAVERN_KEEPER_ADDRESS],
            });

            console.log('Grant Role Tx Sent:', hash);
        } else {
            console.log('TavernKeeper already has MINTER_ROLE.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
