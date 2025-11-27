'use client';

import dynamic from 'next/dynamic';
import { PixelButton, PixelPanel } from '../../components/PixelComponents';

const PixiMap = dynamic(() => import('../../components/PixiMap'), {
  ssr: false,
  loading: () => <div className="w-[800px] h-[600px] bg-slate-900 flex items-center justify-center text-white font-pixel">Loading Map...</div>
});

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#2a1d17] p-8 flex flex-col items-center gap-8 font-pixel">
      <header className="w-full max-w-6xl flex justify-between items-center mb-4">
        <h1 className="text-4xl text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">Dungeon Map</h1>
        <PixelButton variant="secondary" onClick={() => window.location.href = '/'}>Back to Inn</PixelButton>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Map Controls & Legend */}
        <div className="flex flex-col gap-6">
          <PixelPanel title="Controls" variant="wood">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 justify-center">
                <PixelButton size="sm" variant="secondary">⏮</PixelButton>
                <PixelButton size="sm" variant="primary">⏯</PixelButton>
                <PixelButton size="sm" variant="secondary">⏭</PixelButton>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <span className="text-xs text-[#eaddcf]/70">Speed:</span>
                <PixelButton size="sm" variant="secondary">1x</PixelButton>
                <PixelButton size="sm" variant="secondary">2x</PixelButton>
              </div>
            </div>
          </PixelPanel>

          <PixelPanel title="Legend" variant="paper">
            <div className="grid grid-cols-2 gap-2 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-500 border border-black/20"></div> Unknown
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 border border-black/20"></div> Room
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 border border-black/20"></div> Enemy
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 border border-black/20"></div> Loot
              </div>
            </div>
          </PixelPanel>

          <PixelPanel title="Current Room" variant="wood">
            <div className="text-sm text-[#eaddcf]">
              <p className="mb-2"><strong className="text-yellow-400">The Damp Hallway</strong></p>
              <p className="italic opacity-80">A narrow corridor smelling of mildew. Cobwebs hang from the ceiling.</p>
            </div>
          </PixelPanel>
        </div>

        {/* Center: Map Visualization */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="border-4 border-[#1a120b] shadow-2xl">
            <PixiMap width={800} height={600} />
          </div>
        </div>
      </div>
    </main>
  );
}
