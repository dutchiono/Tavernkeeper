
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { AutoConnectWallet } from '../AutoConnectWallet';
import { wagmiConfig } from '../../lib/wagmi-miniapp';
import sdk from '@farcaster/miniapp-sdk';

type MiniappProviderProps = {
  children: ReactNode;
};

export function MiniappProvider({ children }: MiniappProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 15_000,
          },
        },
      }),
  );

  // Call sdk.actions.ready() IMMEDIATELY when provider mounts
  // This must be called as early as possible to hide the splash screen
  useEffect(() => {
    const callReady = async () => {
      try {
        const insideMiniApp = await sdk.isInMiniApp();
        if (insideMiniApp) {
          await sdk.actions.ready();
          console.log('✅ sdk.actions.ready() called in MiniappProvider');
        }
      } catch (err) {
        console.error('Failed to call sdk.actions.ready() in provider:', err);
      }
    };
    // Call immediately, don't wait
    void callReady();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AutoConnectWallet forceConnect={true} />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
