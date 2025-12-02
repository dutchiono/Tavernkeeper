
import { createPublicClient, http, formatEther, defineChain } from 'viem';

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

    try {
        const slot0 = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'getSlot0',
        });

        const owner = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'owner',
        });

        const block = await client.getBlock();

        console.log('--- State Inspection ---');
        console.log('Owner:', owner);
        console.log('Block Timestamp:', Number(block.timestamp));
        console.log('Slot0 StartTime:', Number(slot0.startTime));
        console.log('Slot0 Locked:', slot0.locked);
        console.log('Slot0 Miner:', slot0.miner);
        console.log('Slot0 EpochId:', slot0.epochId);

        if (slot0.locked === 2) {
            console.error('CRITICAL: Contract is LOCKED (Reentrancy Guard stuck)');
        }

        if (Number(block.timestamp) < Number(slot0.startTime)) {
            console.error('CRITICAL: Block timestamp is BEHIND startTime (Underflow risk)');
        }

        if (owner === '0x0000000000000000000000000000000000000000') {
            console.error('CRITICAL: Owner is ZERO address');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
