
import { createPublicClient, http, defineChain, formatEther } from 'viem';

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

const CELLAR_ADDRESS = '0xC1D9e381dF88841b16e9d01f35802B0583638e07';

const ABI = [
    {
        inputs: [],
        name: 'potBalance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MON',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    }
] as const;

async function main() {
    const client = createPublicClient({
        chain: localnet,
        transport: http(),
    });

    try {
        const balance = await client.getBalance({ address: CELLAR_ADDRESS });
        const potBalance = await client.readContract({
            address: CELLAR_ADDRESS,
            abi: ABI,
            functionName: 'potBalance',
        });
        const mon = await client.readContract({
            address: CELLAR_ADDRESS,
            abi: ABI,
            functionName: 'MON',
        });

        console.log('--- Cellar Status ---');
        console.log('Address:', CELLAR_ADDRESS);
        console.log('Native ETH Balance:', formatEther(balance), 'ETH');
        console.log('Pot Balance (State):', formatEther(potBalance), 'MON');
        console.log('MON Token Address:', mon);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
