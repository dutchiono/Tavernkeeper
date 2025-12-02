
import { createPublicClient, http, defineChain } from 'viem';

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
        const mon = await client.readContract({
            address: CELLAR_ADDRESS,
            abi: ABI,
            functionName: 'MON',
        });

        console.log('Cellar MON Currency:', mon);

        if (mon === '0x0000000000000000000000000000000000000000') {
            console.log('MON is Native ETH.');
            console.log('receive() function writes to storage (potBalance += msg.value).');
            console.log('This costs > 2300 gas.');
            console.log('TavernKeeper using .transfer() will FAIL.');
        } else {
            console.log('MON is ERC20.');
            console.log('receive() function does nothing.');
            console.log('.transfer() should succeed.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
