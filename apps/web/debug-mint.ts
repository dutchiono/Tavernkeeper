
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

const TAVERN_KEEPER_ADDRESS = '0x193C700Ff3A554597907e4eA894d4040f38287b7';
const KEEP_TOKEN_ADDRESS = '0xc03bC9D0BD59b98535aEBD2102221AeD87c820A6';

// Use a known private key from Anvil/Hardhat (Account #0)
const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const KEEP_ABI = [
    {
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'mint',
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

    console.log('--- Testing KeepToken Minting ---');

    try {
        // Try to mint directly as the test account (should fail if not minter, but we want to see IF it reverts cleanly)
        // Actually, we want to know if TAVERN_KEEPER can mint. We can't easily simulate AS TavernKeeper without `impersonateAccount`.

        // Let's try to impersonate TavernKeeper using Anvil RPC method
        await walletClient.request({
            method: 'anvil_impersonateAccount',
            params: [TAVERN_KEEPER_ADDRESS],
        });

        console.log('Impersonated TavernKeeper');

        const { request } = await client.simulateContract({
            address: KEEP_TOKEN_ADDRESS,
            abi: KEEP_ABI,
            functionName: 'mint',
            args: [account.address, parseEther('100')], // Mint 100 KEEP to ourself
            account: TAVERN_KEEPER_ADDRESS, // Send AS TavernKeeper
        });

        console.log('Mint Simulation SUCCESS');

        await walletClient.request({
            method: 'anvil_stopImpersonatingAccount',
            params: [TAVERN_KEEPER_ADDRESS],
        });

    } catch (error: any) {
        console.error('Mint Simulation FAILED:');
        if (error.cause) console.error('Cause:', error.cause);
        if (error.shortMessage) console.error('Short:', error.shortMessage);
    }
}

main();
