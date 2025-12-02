'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
<<<<<<< HEAD
import { localhost } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
=======
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
import { monad } from '../../lib/chains';

const queryClient = new QueryClient();

// Support both localhost (for local dev) and Monad (for production/testnet)
const chains = (process.env.NODE_ENV === 'development'
    ? [localhost, monad]
    : [monad]) as [typeof monad, ...typeof monad[]];

const config = createConfig({
    chains,
    transports: {
        [localhost.id]: http('http://127.0.0.1:8545'),
        [monad.id]: http(),
    },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm456578004s1129384756'}
            config={{
                loginMethods: ['wallet'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#676FFF',
                },
<<<<<<< HEAD
                supportedChains: chains,
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
=======
                supportedChains: [monad],
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
        </PrivyProvider>
    );
}
