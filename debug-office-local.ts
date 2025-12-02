
import { createPublicClient, http, formatEther, parseEther, defineChain } from 'viem';

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

const ABI = [
    {
        inputs: [],
        name: 'getSlot0',
        outputs: [
            {
                components: [
                    { name: 'locked', type: 'uint8' },
                    { name: 'epochId', type: 'uint16' },
                    { name: 'initPrice', type: 'uint192' },
                    { name: 'startTime', type: 'uint40' },
                    { name: 'dps', type: 'uint256' },
                    { name: 'miner', type: 'address' },
                    { name: 'uri', type: 'string' },
                ],
                internalType: 'struct TavernKeeper.Slot0',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getPrice',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    }
] as const;

async function main() {
    const client = createPublicClient({
        chain: localnet,
        transport: http(),
    });

    console.log(`Checking TavernKeeper at ${TAVERN_KEEPER_ADDRESS} on Localhost`);

    try {
        const slot0 = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'getSlot0',
        });

        console.log('--- Slot0 State ---');
        console.log('Epoch ID:', slot0.epochId);
        console.log('Miner (King):', slot0.miner);
        console.log('Init Price:', formatEther(slot0.initPrice), 'ETH');
        console.log('Start Time:', Number(slot0.startTime));
        console.log('Locked:', slot0.locked);

        const price = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'getPrice',
        });

        console.log('--- Current Price ---');
        console.log('Price (Wei):', price.toString());
        console.log('Price (ETH):', formatEther(price));

        // Check against the failed tx values from logs
        // args: (1, 1764711107, 104941666666667, )
        const failedEpochId = 1;
        const failedMaxPrice = 104941666666667n;

        console.log('--- Analysis ---');
        if (slot0.epochId !== failedEpochId) {
            console.log(`MISMATCH: Contract Epoch (${slot0.epochId}) != Tx Epoch (${failedEpochId})`);
            console.log('This will cause the transaction to revert.');
        } else {
            console.log('Epoch ID matches.');
        }

        if (price > failedMaxPrice) {
            console.log(`FAILURE: Current Price (${price}) > Max Price (${failedMaxPrice})`);
            console.log(`Difference: ${price - failedMaxPrice} wei`);
            console.log('This will cause the transaction to revert.');
        } else {
            console.log('Price is within limits.');
        }

        if (slot0.locked !== 0) {
            console.log(`FAILURE: Office is LOCKED (status ${slot0.locked})`);
        }

    } catch (error) {
        console.error('Error fetching state:', error);
        console.error('Make sure your local node is running at http://127.0.0.1:8545');
    }
}

main();
