
import { createPublicClient, createWalletClient, http, formatEther, parseEther, defineChain, custom } from 'viem';
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
const CELLAR_ADDRESS = '0xC1D9e381dF88841b16e9d01f35802B0583638e07'; // From addresses.ts (Localhost)

// Use a known private key from Anvil/Hardhat (Account #0)
const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const ABI = [
    {
        inputs: [],
        name: 'treasury',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: '_treasury', type: 'address' }],
        name: 'setTreasury',
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

    console.log(`Checking Treasury at ${TAVERN_KEEPER_ADDRESS} on Localhost`);

    try {
        const treasury = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'treasury',
        });

        console.log('Current Treasury Address:', treasury);
        console.log('Expected Cellar Address:', CELLAR_ADDRESS);

        if (treasury === '0x0000000000000000000000000000000000000000') {
            console.log('Treasury is ZERO! Attempting to set it to Cellar...');

            const hash = await walletClient.writeContract({
                address: TAVERN_KEEPER_ADDRESS,
                abi: ABI,
                functionName: 'setTreasury',
                args: [CELLAR_ADDRESS],
            });

            console.log('Set Treasury Tx Sent:', hash);
        } else {
            console.log('Treasury is already set.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
