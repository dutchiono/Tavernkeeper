import { createPublicClient, formatEther, http, parseEther } from 'viem';
import { monad } from '../chains';
import { CONTRACT_REGISTRY, getContractAddress } from '../contracts/registry';

export interface CellarState {
    potSize: string; // MON in the contract
    potSizeKeep?: string; // KEEP in the contract (optional for back compat if needed)
    currentPrice: string; // LP tokens required to buy
    epochId: number;
    startTime: number;
    initPrice: string;
    paymentToken: string;
}

export const theCellarService = {
    _cache: {
        data: null as CellarState | null,
        timestamp: 0,
        ttl: 10000 // 10 seconds cache
    },

    clearCache() {
        this._cache.data = null;
        this._cache.timestamp = 0;
    },

    async getCellarState(): Promise<CellarState> {
        const now = Date.now();
        if (this._cache.data && (now - this._cache.timestamp < this._cache.ttl)) {
            return this._cache.data;
        }

        try {
            const contractConfig = CONTRACT_REGISTRY.THECELLAR;
            const contractAddress = getContractAddress(contractConfig);

            if (!contractAddress) {
                console.error('THECELLAR: Contract address not found. Check CONTRACT_ADDRESSES.');
                throw new Error("TheCellar contract not found");
            }

            // Use RPC from env or default based on chain ID
            const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL ||
                (monad.id === 143 ? 'https://rpc.monad.xyz' : 'https://testnet-rpc.monad.xyz');

            const publicClient = createPublicClient({
                chain: monad,
                transport: http(rpcUrl),
            });

            const results = await Promise.allSettled([
                publicClient.readContract({
                    address: contractAddress,
                    abi: contractConfig.abi,
                    functionName: 'potBalanceMON',
                    args: [],
                }),
                publicClient.readContract({
                    address: contractAddress,
                    abi: contractConfig.abi,
                    functionName: 'potBalanceKEEP',
                    args: [],
                }),
            ]);

            let potMON = 0n;
            let potKEEP = 0n;

            if (results[0].status === 'fulfilled') {
                potMON = results[0].value as bigint;
            }
            if (results[1].status === 'fulfilled') {
                potKEEP = results[1].value as bigint;
            }

            const newState = {
                potSize: formatEther(potMON), // MON share of pot
                potSizeKeep: formatEther(potKEEP), // KEEP share of pot
                currentPrice: '1.0', // V3 Mint is 1:1, simplify display
                epochId: 0,
                startTime: now,
                initPrice: '1.0',
                paymentToken: contractAddress, // The Cellar contract logic handles payment
            };

            this._cache.data = newState;
            this._cache.timestamp = now;

            return newState;
        } catch (error) {
            console.error("Error fetching V3 cellar state:", error);
            if (this._cache.data) return this._cache.data;
            return {
                potSize: '0',
                potSizeKeep: '0',
                currentPrice: '0',
                epochId: 0,
                startTime: Date.now(),
                initPrice: '0',
                paymentToken: '0x0000000000000000000000000000000000000000',
            };
        }
    },

    async getAllowance(owner: string, tokenAddress: string): Promise<bigint> {
        // CellarHook (CLP) is the token and the spender (burner).
        // Since raid() calls _burn(msg.sender), no approval is needed.
        // We return max uint256 to simulate infinite approval.
        return 115792089237316195423570985008687907853269984665640564039457584007913129639935n;
    },

    async approve(client: any, tokenAddress: string, amount: bigint) {
        // No-op for CellarHook raid
        return "0x";
    },

    async claim(client: any, lpBid: bigint) {
        const contractConfig = CONTRACT_REGISTRY.THECELLAR;
        const contractAddress = getContractAddress(contractConfig);

        if (!contractAddress) throw new Error("TheCellar contract not found");

        const hash = await client.writeContract({
            address: contractAddress,
            abi: contractConfig.abi,
            functionName: 'raid',
            chain: monad,
            account: client.account,
            args: [lpBid],
        });

        return hash;
    },

    async addLiquidity(client: any, amountMON: bigint, amountKEEP: bigint) {
        const contractConfig = CONTRACT_REGISTRY.THECELLAR;
        const contractAddress = getContractAddress(contractConfig);
        if (!contractAddress) throw new Error("TheCellar contract not found");

        const hash = await client.writeContract({
            address: contractAddress,
            abi: contractConfig.abi,
            functionName: 'addLiquidity',
            chain: monad,
            account: client.account,
            args: [amountMON, amountKEEP],
        });

        return hash;
    },

    async recoverLiquidity(client: any, lpAmount: bigint) {
        const contractConfig = CONTRACT_REGISTRY.THECELLAR;
        const contractAddress = getContractAddress(contractConfig);
        if (!contractAddress) throw new Error("TheCellar contract not found");

        // V3: Call 'withdraw'
        const hash = await client.writeContract({
            address: contractAddress,
            abi: contractConfig.abi,
            functionName: 'withdraw',
            chain: monad,
            account: client.account,
            args: [lpAmount],
        });

        return hash;
    },

    async getUserLpBalance(userAddress: string): Promise<bigint> {
        const contractConfig = CONTRACT_REGISTRY.CELLAR_TOKEN;
        const contractAddress = getContractAddress(contractConfig);

        if (!contractAddress) {
            console.error("CellarToken contract not found");
            return 0n;
        }

        // Use RPC from env or default based on chain ID
        const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL ||
            (monad.id === 143 ? 'https://rpc.monad.xyz' : 'https://testnet-rpc.monad.xyz');

        const publicClient = createPublicClient({
            chain: monad,
            transport: http(rpcUrl),
        });

        try {
            const balance = await publicClient.readContract({
                address: contractAddress,
                abi: contractConfig.abi,
                functionName: 'balanceOf',
                args: [userAddress as `0x${string}`],
            });
            return balance as bigint;
        } catch (error) {
            console.error("Error fetching LP balance:", error);
            return 0n;
        }
    },

    async getKeepAllowance(userAddress: string, spenderAddress: string): Promise<bigint> {
        const contractConfig = CONTRACT_REGISTRY.KEEP_TOKEN;
        const contractAddress = getContractAddress(contractConfig);

        if (!contractAddress) throw new Error("KEEP Token contract not found");

        // Use RPC from env or default based on chain ID
        const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL ||
            (monad.id === 143 ? 'https://rpc.monad.xyz' : 'https://testnet-rpc.monad.xyz');

        const publicClient = createPublicClient({
            chain: monad,
            transport: http(rpcUrl),
        });

        try {
            const allowance = await publicClient.readContract({
                address: contractAddress,
                abi: contractConfig.abi,
                functionName: 'allowance',
                args: [userAddress as `0x${string}`, spenderAddress as `0x${string}`],
            });
            return allowance as bigint;
        } catch (error) {
            console.error("Error fetching KEEP allowance:", error);
            return 0n;
        }
    },

    async approveKeep(client: any, spenderAddress: string, amount: bigint) {
        const contractConfig = CONTRACT_REGISTRY.KEEP_TOKEN;
        const contractAddress = getContractAddress(contractConfig);

        if (!contractAddress) throw new Error("KEEP Token contract not found");

        const hash = await client.writeContract({
            address: contractAddress,
            abi: contractConfig.abi,
            functionName: 'approve',
            chain: monad,
            account: client.account,
            args: [spenderAddress, amount],
        });

        return hash;
    }
};
