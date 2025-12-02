
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
        name: 'tavernKeeperContract',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: '_contract', type: 'address' }],
        name: 'setTavernKeeperContract',
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

    console.log(`Checking TavernKeeper Auth on KeepToken (${KEEP_TOKEN_ADDRESS})`);

    try {
        const authorizedContract = await client.readContract({
            address: KEEP_TOKEN_ADDRESS,
            abi: ABI,
            functionName: 'tavernKeeperContract',
        });

        console.log('Authorized Contract:', authorizedContract);
        console.log('Expected Contract:', TAVERN_KEEPER_ADDRESS);

        if (authorizedContract !== TAVERN_KEEPER_ADDRESS) {
            console.log('TavernKeeper NOT authorized! Updating...');

            const hash = await walletClient.writeContract({
                address: KEEP_TOKEN_ADDRESS,
                abi: ABI,
                functionName: 'setTavernKeeperContract',
                args: [TAVERN_KEEPER_ADDRESS],
            });

            console.log('Set TavernKeeper Contract Tx Sent:', hash);
        } else {
            console.log('TavernKeeper is correctly authorized.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
