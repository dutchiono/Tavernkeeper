
import { createPublicClient, http, defineChain, formatEther } from 'viem';
import { LOCALHOST_ADDRESSES } from './lib/contracts/addresses';

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

const CELLAR_ABI = [
    {
        inputs: [],
        name: 'minInitPrice',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'potBalance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    }
] as const;

const MANAGER_ABI = [
    {
        inputs: [],
        name: 'owner',
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

    console.log('--- Checking CellarHook ---');
    try {
        const minPrice = await client.readContract({
            address: LOCALHOST_ADDRESSES.THE_CELLAR,
            abi: CELLAR_ABI,
            functionName: 'minInitPrice',
        });
        const pot = await client.readContract({
            address: LOCALHOST_ADDRESSES.THE_CELLAR,
            abi: CELLAR_ABI,
            functionName: 'potBalance',
        });
        console.log(`Cellar Address: ${LOCALHOST_ADDRESSES.THE_CELLAR}`);
        console.log(`Min Init Price: ${formatEther(minPrice)} MON`);
        console.log(`Pot Balance: ${formatEther(pot)} MON`);
    } catch (e) {
        console.error('Failed to read CellarHook:', e);
    }

    console.log('\n--- Checking TownPosseManager ---');
    try {
        const owner = await client.readContract({
            address: LOCALHOST_ADDRESSES.TOWN_POSSE_MANAGER,
            abi: MANAGER_ABI,
            functionName: 'owner',
        });
        console.log(`Posse Address: ${LOCALHOST_ADDRESSES.TOWN_POSSE_MANAGER}`);
        console.log(`Owner: ${owner}`);
    } catch (e) {
        console.error('Failed to read TownPosseManager:', e);
    }

    console.log('\n--- Checking TavernRegularsManager ---');
    try {
        const owner = await client.readContract({
            address: LOCALHOST_ADDRESSES.TAVERN_REGULARS_MANAGER,
            abi: MANAGER_ABI,
            functionName: 'owner',
        });
        console.log(`Regulars Address: ${LOCALHOST_ADDRESSES.TAVERN_REGULARS_MANAGER}`);
        console.log(`Owner: ${owner}`);
    } catch (e) {
        console.error('Failed to read TavernRegularsManager:', e);
    }
}

main();
