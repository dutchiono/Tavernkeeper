/**
 * Unified Wallet Client Hook
 *
 * Works in both web (Privy) and miniapp (Farcaster SDK) contexts
 * Returns a wallet client that can be used for transactions
 */

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { createWalletClient, custom, type WalletClient } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { monad } from '../chains';
import { createFarcasterWalletClient } from '../services/farcasterWallet';
import { isInFarcasterMiniapp } from '../utils/farcasterDetection';
import { wagmiConfig } from '../wagmi-miniapp';
import { useSafeAccount } from './useSafeAccount';

export function useUnifiedWalletClient() {
    const isMiniapp = isInFarcasterMiniapp();
    const privy = usePrivy();
    const { address: wagmiAddress } = useAccount();
    const { address: safeAddress } = useSafeAccount();
    const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const setupWalletClient = async () => {
            setIsLoading(true);

            if (isMiniapp) {
                // Miniapp: Check valid connectors (Farcaster or Fallback)
                try {
                    // If we have an active wagmi account with a connector, use that first
                    // This supports the "fallback" injected connector we added
                    const { connector } = await import('wagmi/actions').then(m => m.getAccount(wagmiConfig));

                    if (connector?.id === 'farcaster-miniapp') {
                        const client = await createFarcasterWalletClient();
                        setWalletClient(client);
                    } else if (connector && wagmiAddress) {
                        // Injected or other wagmi connector
                        const provider = await connector.getProvider();
                        const client = createWalletClient({
                            account: wagmiAddress as `0x${string}`,
                            chain: monad,
                            transport: custom(provider as any),
                        });
                        setWalletClient(client);
                    } else {
                        // Default to Farcaster attempt if no connector yet
                        // But if we are here, we might just need to wait for connection
                        const client = await createFarcasterWalletClient().catch(() => null);
                        setWalletClient(client);
                    }
                } catch (error) {
                    console.error('Failed to create Miniapp wallet client:', error);
                    setWalletClient(null);
                }
            } else {
                // Web: Use Privy wallet
                try {
                    if (privy.authenticated && safeAddress) {
                        const provider = await privy.getEthereumProvider();
                        if (provider) {
                            const client = createWalletClient({
                                account: safeAddress as `0x${string}`,
                                chain: monad,
                                transport: custom(provider),
                            });
                            setWalletClient(client);
                        } else {
                            setWalletClient(null);
                        }
                    } else {
                        setWalletClient(null);
                    }
                } catch (error) {
                    console.error('Failed to create Privy wallet client:', error);
                    setWalletClient(null);
                }
            }

            setIsLoading(false);
        };

        setupWalletClient();
    }, [isMiniapp, privy.authenticated, safeAddress]);

    return { walletClient, isLoading };
}

/**
 * Hook for writeContract that works in both contexts
 */
export function useUnifiedWriteContract() {
    const isMiniapp = isInFarcasterMiniapp();
    const wagmiWriteContract = useWriteContract();
    const { walletClient } = useUnifiedWalletClient();

    // In miniapp, use Wagmi's writeContract (via AutoConnectWallet)
    // In web, use Privy wallet client directly
    if (isMiniapp) {
        return wagmiWriteContract;
    }

    // For web, return a wrapper that uses Privy wallet client
    return {
        writeContract: async (params: any) => {
            if (!walletClient) {
                throw new Error('Wallet not connected');
            }
            // Use walletClient.writeContract directly
            return walletClient.writeContract(params);
        },
        isPending: false,
        data: undefined,
        reset: () => { },
    };
}

