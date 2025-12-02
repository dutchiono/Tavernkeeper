
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

// Use a known private key from Anvil/Hardhat (Account #0)
const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

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
    },
    {
        inputs: [
            { name: 'epochId', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'maxPrice', type: 'uint256' },
            { name: 'uri', type: 'string' },
        ],
        name: 'takeOffice',
        outputs: [{ name: 'price', type: 'uint256' }],
        stateMutability: 'payable',
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

        // Prepare parameters for simulation
        const epochId = BigInt(slot0.epochId);
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 300);
        // Add 10% buffer to price
        const maxPrice = price + (price * 10n / 100n);
        const uri = "Debug Take Office";

        console.log('--- Simulating takeOffice ---');
        console.log(`Params: Epoch=${epochId}, Deadline=${deadline}, MaxPrice=${maxPrice}, URI=${uri}`);
        console.log(`Value: ${maxPrice} (sending maxPrice as value)`);

        try {
            const { request } = await client.simulateContract({
                address: TAVERN_KEEPER_ADDRESS,
                abi: ABI,
                functionName: 'takeOffice',
                args: [epochId, deadline, maxPrice, uri],
                value: maxPrice,
                account: account,
            });
            console.log('Simulation SUCCESS!');

            // If simulation succeeds, try to execute
            const hash = await walletClient.writeContract(request);
            console.log('Transaction sent:', hash);

        } catch (simError: any) {
            console.error('Simulation FAILED:');
            // console.error(JSON.stringify(simError, null, 2));
            if (simError.cause) {
                console.error('Cause:', simError.cause);
            }
            if (simError.metaMessages) {
                console.error('Meta Messages:', simError.metaMessages);
            }
            if (simError.shortMessage) {
                console.error('Short Message:', simError.shortMessage);
            }
        }

    } catch (error) {
        console.error('Error fetching state:', error);
        console.error('Make sure your local node is running at http://127.0.0.1:8545');
    }
}

main();
