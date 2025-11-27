'use client';

import { useState } from 'react';
import { PixelButton, PixelPanel, PixelCard } from '../../components/PixelComponents';
import { useGameStore } from '../../lib/stores/gameStore';

export default function PartyPage() {
  const { party: agents } = useGameStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Mock personality traits for now
  const [traits, setTraits] = useState({
    aggression: 0.5,
    caution: 0.5,
    curiosity: 0.5,
  });

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <main className="h-screen bg-[#2a1d17] p-8 flex flex-col items-center gap-8 font-pixel overflow-hidden">
      <header className="w-full max-w-6xl flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-4xl text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">Party Manager</h1>
        <PixelButton variant="secondary" onClick={() => window.location.href = '/'}>Back to Inn</PixelButton>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Left: Character List */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <PixelPanel title="Roster" className="h-full flex flex-col" variant="wood">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {agents.length === 0 ? (
                  <div className="text-[#eaddcf]/50 text-center italic p-4">No heroes recruited yet.</div>
                ) : (
                  agents.map((agent) => (
                    <PixelCard
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      variant={selectedAgentId === agent.id ? 'paper' : 'wood'}
                      className={`flex justify-between items-center cursor-pointer ${selectedAgentId === agent.id ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 border border-[#2a1d17] rounded flex items-center justify-center overflow-hidden bg-[#2a1d17]`}>
                          <img
                            src={`/sprites/${agent.class.toLowerCase()}_sitting.png`}
                            alt={agent.class}
                            className="w-full h-full object-cover pixelated"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM1YzQwMzMiLz48L3N2Zz4=';
                            }}
                          />
                        </div>
                        <div>
                          <div className={`font-bold ${selectedAgentId === agent.id ? 'text-amber-950' : 'text-yellow-400'}`}>{agent.name}</div>
                          <div className={`text-xs ${selectedAgentId === agent.id ? 'text-amber-900/70' : 'text-[#eaddcf]/70'}`}>{agent.class} - Lvl {agent.level}</div>
                        </div>
                      </div>
                      <div className={`text-xs ${selectedAgentId === agent.id ? 'text-amber-900' : 'text-[#eaddcf]'}`}>
                        HP {agent.stats.hp}/{agent.stats.maxHp}
                      </div>
                    </PixelCard>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#2a1d17]/20 flex-shrink-0">
              <PixelButton variant="primary" className="w-full">Recruit New Hero</PixelButton>
            </div>
          </PixelPanel>
        </div>

        {/* Center & Right: Character Details */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">
          {selectedAgent ? (
            <PixelPanel title={`Details: ${selectedAgent.name}`} variant="paper" className="h-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full overflow-y-auto pr-2 custom-scrollbar">
                {/* Stats & Gear */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center p-4 bg-[#eaddcf] rounded border-2 border-[#8c7b63] shadow-inner">
                    <div className="w-32 h-32 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/5 rounded-full blur-xl transform scale-75 translate-y-4"></div>
                      <img
                        src={`/sprites/${selectedAgent.class.toLowerCase()}_sitting.png`}
                        alt={selectedAgent.name}
                        className="w-full h-full object-contain pixelated scale-150 transform translate-y-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerText = 'NO SPRITE';
                          e.currentTarget.parentElement!.className += ' text-amber-950/50 text-xs font-bold';
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-[#d4c5b0] p-2 rounded border border-[#8c7b63] flex justify-between">
                      <span className="text-amber-900/70">STR</span>
                      <span className="text-amber-950 font-bold">{selectedAgent.stats?.str || 10}</span>
                    </div>
                    <div className="bg-[#d4c5b0] p-2 rounded border border-[#8c7b63] flex justify-between">
                      <span className="text-amber-900/70">INT</span>
                      <span className="text-amber-950 font-bold">{selectedAgent.stats?.int || 10}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-amber-900 font-bold text-sm mb-2 uppercase tracking-wide">Equipment</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedAgent.inventory?.map((item, i) => (
                        <div key={i} className="aspect-square bg-[#d4c5b0] border border-[#8c7b63] rounded hover:border-amber-600 cursor-pointer flex items-center justify-center text-[8px] text-amber-950" title={item}>
                          {item.substring(0, 2)}
                        </div>
                      ))}
                      {/* Empty slots */}
                      {Array.from({ length: Math.max(0, 8 - (selectedAgent.inventory?.length || 0)) }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square bg-[#d4c5b0]/50 border border-[#8c7b63]/30 rounded flex items-center justify-center">
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personality & AI */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-amber-900 font-bold text-sm uppercase tracking-wide">Personality Matrix</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-amber-900/80 mb-1">
                        <span>Aggression</span>
                        <span>{(traits.aggression * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={traits.aggression}
                        onChange={(e) => setTraits({ ...traits, aggression: parseFloat(e.target.value) })}
                        className="w-full accent-amber-700 h-2 bg-[#d4c5b0] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-amber-900/80 mb-1">
                        <span>Caution</span>
                        <span>{(traits.caution * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={traits.caution}
                        onChange={(e) => setTraits({ ...traits, caution: parseFloat(e.target.value) })}
                        className="w-full accent-amber-700 h-2 bg-[#d4c5b0] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-amber-900/80 mb-1">
                        <span>Curiosity</span>
                        <span>{(traits.curiosity * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={traits.curiosity}
                        onChange={(e) => setTraits({ ...traits, curiosity: parseFloat(e.target.value) })}
                        className="w-full accent-amber-700 h-2 bg-[#d4c5b0] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-[#d4c5b0] rounded border border-[#8c7b63] shadow-sm">
                    <h4 className="text-xs text-amber-900/60 uppercase mb-2">Recent Thoughts</h4>
                    <p className="text-sm text-amber-950 italic">&quot;{selectedAgent.currentThought || '...'}&quot;</p>
                  </div>

                  <div className="mt-auto pt-4">
                    <PixelButton variant="primary" className="w-full">Save Changes</PixelButton>
                  </div>
                </div>
              </div>
            </PixelPanel>
          ) : (
            <div className="h-full flex items-center justify-center text-[#eaddcf]/30 italic border-2 border-dashed border-[#eaddcf]/10 rounded-lg">
              Select a hero to view details
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
