'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { WagmiProvider } from 'wagmi';
import { AutoConnectWallet } from '../AutoConnectWallet';
import { wagmiConfig } from '../../lib/wagmi-unified';
import '@rainbow-me/rainbowkit/styles.css';

type UnifiedWeb3ProviderProps = {
  children: ReactNode;
};

export function UnifiedWeb3Provider({ children }: UnifiedWeb3ProviderProps) {
  const pathname = usePathname();

  // Skip Unified Web3 provider for Miniapp routes
  if (pathname?.startsWith('/miniapp')) {
    return <>{children}</>;
  }
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

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AutoConnectWallet />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

