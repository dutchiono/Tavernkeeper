
import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { monadTestnet } from 'viem/chains';

// Manual definition to avoid import issues
const TAVERN_KEEPER_ADDRESS = '0x193C700Ff3A554597907e4eA894d4040f38287b7'; // From user error log

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
        chain: monadTestnet,
        transport: http('https://testnet-rpc.monad.xyz'), // Using public RPC
    });

    console.log(`Checking TavernKeeper at ${TAVERN_KEEPER_ADDRESS}`);

    try {
        const slot0 = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'getSlot0',
        });

        console.log('--- Slot0 State ---');
        console.log('Epoch ID:', slot0.epochId);
        console.log('Miner (King):', slot0.miner);
        console.log('Init Price:', formatEther(slot0.initPrice), 'MON');
        console.log('Start Time:', Number(slot0.startTime));
        console.log('Locked:', slot0.locked);

        const price = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'getPrice',
        });

        console.log('--- Current Price ---');
        console.log('Price (Wei):', price.toString());
        console.log('Price (MON):', formatEther(price));

        // Check against the failed tx values
        // args: (1, 1764707865, 59500000000000, We Glaze The World)
        const failedEpochId = 1;
        const failedMaxPrice = 59500000000000n; // 0.0000595 MON

        console.log('--- Analysis ---');
        if (slot0.epochId !== failedEpochId) {
            console.log(`MISMATCH: Contract Epoch (${slot0.epochId}) != Tx Epoch (${failedEpochId})`);
        } else {
            console.log('Epoch ID matches.');
        }

        if (price > failedMaxPrice) {
            console.log(`FAILURE: Current Price (${price}) > Max Price (${failedMaxPrice})`);
            console.log(`Difference: ${price - failedMaxPrice} wei`);
        } else {
            console.log('Price is within limits.');
        }

    } catch (error) {
        console.error('Error fetching state:', error);
    }
}

main();
