import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
});

export const metadata: Metadata = {
  title: 'TavernKeeper',
  description: 'A dungeon crawler with AI agents',
};

import { Web3Provider } from '../components/providers/Web3Provider';
import { AuthProvider } from '../components/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.className} bg-black min-h-screen flex justify-center items-center`}>
        <Web3Provider>
          <AuthProvider>
            {/* Mobile Container */}
            <div className="w-full max-w-[480px] h-[100dvh] bg-slate-900 relative flex flex-col shadow-2xl overflow-hidden border-x border-slate-800">

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto relative scrollbar-hide">
                {children}
              </div>

              {/* Bottom Navigation Bar */}
              <nav className="h-20 bg-[#2a1d17] border-t-4 border-[#eaddcf] flex justify-around items-center px-2 z-50 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
                <a href="/" className="flex flex-col items-center gap-1 p-2 group">
                  <div className="w-10 h-10 bg-[#4a3b32] border-2 border-[#855e42] group-hover:border-[#eaddcf] group-hover:bg-[#5c4b40] rounded-sm flex items-center justify-center text-xl shadow-md transition-all group-hover:-translate-y-1">
                    🍺
                  </div>
                  <span className="text-[8px] uppercase text-[#eaddcf] font-bold tracking-widest group-hover:text-white drop-shadow-md">Inn</span>
                </a>
                <a href="/map" className="flex flex-col items-center gap-1 p-2 group">
                  <div className="w-10 h-10 bg-[#4a3b32] border-2 border-[#855e42] group-hover:border-[#eaddcf] group-hover:bg-[#5c4b40] rounded-sm flex items-center justify-center text-xl shadow-md transition-all group-hover:-translate-y-1">
                    🗺️
                  </div>
                  <span className="text-[8px] uppercase text-[#eaddcf] font-bold tracking-widest group-hover:text-white drop-shadow-md">Map</span>
                </a>
                <a href="/battle" className="flex flex-col items-center gap-1 p-2 group">
                  <div className="w-10 h-10 bg-[#4a3b32] border-2 border-[#855e42] group-hover:border-[#eaddcf] group-hover:bg-[#5c4b40] rounded-sm flex items-center justify-center text-xl shadow-md transition-all group-hover:-translate-y-1">
                    ⚔️
                  </div>
                  <span className="text-[8px] uppercase text-[#eaddcf] font-bold tracking-widest group-hover:text-white drop-shadow-md">Battle</span>
                </a>
                <a href="/party" className="flex flex-col items-center gap-1 p-2 group">
                  <div className="w-10 h-10 bg-[#4a3b32] border-2 border-[#855e42] group-hover:border-[#eaddcf] group-hover:bg-[#5c4b40] rounded-sm flex items-center justify-center text-xl shadow-md transition-all group-hover:-translate-y-1">
                    👥
                  </div>
                  <span className="text-[8px] uppercase text-[#eaddcf] font-bold tracking-widest group-hover:text-white drop-shadow-md">Party</span>
                </a>
              </nav>

              {/* Scanline Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%] opacity-20" />
            </div>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

