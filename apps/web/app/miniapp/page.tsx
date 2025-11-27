'use client';

import { useState } from 'react';
import { PixelButton, PixelPanel } from '../../components/PixelComponents';

export default function MiniappPage() {
  const [activeFrame, setActiveFrame] = useState<'home' | 'party' | 'adventure'>('home');
  // Note: Farcaster auth would be accessed via AuthKitProvider context if needed

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans max-w-[600px] mx-auto border-x border-slate-800">
      {/* Header */}
      <header className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
        <h1 className="font-pixel text-amber-500 text-lg">TavernKeeper Mini</h1>
        <div className="text-xs text-slate-400">v0.1</div>
      </header>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-4">
        {activeFrame === 'home' && (
          <div className="flex flex-col gap-4">
            <div className="aspect-video bg-slate-800 rounded border border-slate-600 flex items-center justify-center">
              <span className="font-pixel text-slate-500">INN SCENE</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PixelButton onClick={() => setActiveFrame('adventure')} className="w-full py-4">Adventure</PixelButton>
              <PixelButton onClick={() => setActiveFrame('party')} variant="secondary" className="w-full py-4">Party</PixelButton>
            </div>

            <PixelPanel title="Status">
              <div className="flex justify-between text-sm">
                <span>Gold</span>
                <span className="text-amber-400">1,250</span>
              </div>
            </PixelPanel>
          </div>
        )}

        {activeFrame === 'party' && (
          <div className="flex flex-col gap-4">
            <PixelButton size="sm" variant="secondary" onClick={() => setActiveFrame('home')}>← Back</PixelButton>

            <div className="flex flex-col gap-2">
              {['Gimli', 'Legolas', 'Gandalf'].map((name) => (
                <div key={name} className="bg-slate-800 p-3 rounded border border-slate-600 flex justify-between items-center">
                  <div className="font-bold">{name}</div>
                  <div className="text-xs text-green-400">READY</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeFrame === 'adventure' && (
          <div className="flex flex-col gap-4">
            <PixelButton size="sm" variant="secondary" onClick={() => setActiveFrame('home')}>← Retreat</PixelButton>

            <div className="aspect-square bg-slate-800 rounded border border-slate-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="font-pixel text-red-500 animate-pulse">COMBAT!</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <PixelButton variant="danger" className="w-full">Attack</PixelButton>
              <PixelButton variant="secondary" className="w-full">Defend</PixelButton>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav (Simulated Frame Buttons) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[600px] mx-auto bg-slate-800 p-2 border-t border-slate-700 flex gap-2">
        <button className="flex-1 bg-slate-700 text-white py-3 rounded text-sm font-bold">Refresh</button>
        <button className="flex-1 bg-slate-700 text-white py-3 rounded text-sm font-bold">Share</button>
      </div>
    </main>
  );
}
