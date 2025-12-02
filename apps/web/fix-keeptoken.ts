
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
const KEEP_TOKEN_ADDRESS = '0xc03bC9D0BD59b98535aEBD2102221AeD87c820A6'; // From addresses.ts (Localhost)

// Use a known private key from Anvil/Hardhat (Account #0)
const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const ABI = [
    {
        inputs: [],
        name: 'keepToken',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: '_keepToken', type: 'address' }],
        name: 'setKeepTokenContract',
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

    console.log(`Checking KeepToken at ${TAVERN_KEEPER_ADDRESS} on Localhost`);

    try {
        const keepToken = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'keepToken',
        });

        console.log('Current KeepToken Address:', keepToken);
        console.log('Expected KeepToken Address:', KEEP_TOKEN_ADDRESS);

        if (keepToken === '0x0000000000000000000000000000000000000000') {
            console.log('KeepToken is ZERO! Attempting to set it...');

            const hash = await walletClient.writeContract({
                address: TAVERN_KEEPER_ADDRESS,
                abi: ABI,
                functionName: 'setKeepTokenContract',
                args: [KEEP_TOKEN_ADDRESS],
            });

            console.log('Set KeepToken Tx Sent:', hash);
        } else {
            console.log('KeepToken is already set.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
