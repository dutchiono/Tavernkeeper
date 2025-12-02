
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
    }
] as const;

async function main() {
    const client = createPublicClient({
        chain: localnet,
        transport: http(),
    });

    console.log(`Checking Previous King at ${TAVERN_KEEPER_ADDRESS} on Localhost`);

    try {
        const slot0 = await client.readContract({
            address: TAVERN_KEEPER_ADDRESS,
            abi: ABI,
            functionName: 'getSlot0',
        });

        console.log('Current King (Miner):', slot0.miner);

        const code = await client.getBytecode({ address: slot0.miner });
        console.log('King Code Size:', code ? code.length : 0);

        if (code && code.length > 0) {
            console.log('WARNING: Current King is a CONTRACT. It might be rejecting ETH transfers.');
        } else {
            console.log('Current King is an EOA (Externally Owned Account). Should accept ETH.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
