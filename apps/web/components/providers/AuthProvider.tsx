'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'tavernkeeper.vercel.app', // TODO: Update with actual domain
    siweUri: 'https://tavernkeeper.vercel.app/login', // TODO: Update with actual SIWE URI
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthKitProvider config={config}>
            {children}
        </AuthKitProvider>
    );
}
