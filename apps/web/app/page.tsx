'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '../lib/stores/gameStore';
import { GameView } from '../lib/types';
import { InnScene } from '../components/scenes/InnScene';
import { MapScene } from '../components/scenes/MapScene';
import { BattleScene } from '../components/scenes/BattleScene';
import { PixelBox, PixelButton } from '../components/PixelComponents';
import { Beer, Map as MapIcon, ScrollText, Users, Menu } from 'lucide-react';
import { SignInButton } from '@farcaster/auth-kit';

export default function Home() {
  const { currentView, switchView, logs, party, selectAgent } = useGameStore();

  // Initialize game loop or data fetching here if needed
  useEffect(() => {
    // Example: Add a welcome log
    useGameStore.getState().addLog({
      id: Date.now(),
      message: "Welcome to the TavernKeeper. The fire is warm.",
      type: 'info',
      timestamp: new Date().toLocaleTimeString()
    });
  }, []);

  return (
    <main className="h-full w-full flex flex-col font-pixel">
      {/* Mobile Container Wrapper - Filling Parent from Layout */}
      <div className="flex-1 relative flex flex-col overflow-hidden">

        {/* --- TOP BAR: Title & Status --- */}
        <div className="h-12 bg-[#2a1d17] border-b-4 border-[#1a120b] flex items-center justify-between px-4 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-yellow-400 text-sm md:text-lg font-bold tracking-widest px-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
              TAVERN<span className="text-white">KEEPER</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <SignInButton />
            <div className="hidden md:flex items-center gap-4 px-4 bg-black/30 py-1 rounded border border-white/5">
              <div className="text-[10px] text-yellow-400 flex flex-col items-end leading-tight">
                <span>DAY 1</span>
                <span className="text-white/50">450g</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN SCENE AREA --- */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {currentView === GameView.INN && (
            <InnScene />
          )}
          {currentView === GameView.MAP && (
            <MapScene />
          )}
          {currentView === GameView.BATTLE && (
            <BattleScene
              party={party}
              onComplete={(success) => {
                useGameStore.getState().addLog({
                  id: Date.now(),
                  message: success ? "Victory! The party returns to the inn." : "Defeat... The party retreats.",
                  type: 'combat',
                  timestamp: new Date().toLocaleTimeString()
                });
                switchView(GameView.INN);
              }}
            />
          )}

          {/* LOG OVERLAY (Floating on top of scene) */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[95%] h-[55%] z-30 pointer-events-none flex flex-col gap-2">
            <PixelBox className="w-full flex-1 pointer-events-auto opacity-95 shadow-2xl" variant="paper" title="Inn Log">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar p-2">
                  {logs.map((log) => (
                    <div key={log.id} className="text-sm leading-relaxed border-b border-amber-900/20 pb-2 flex flex-col gap-1">
                      <span className="text-amber-900/60 font-mono text-[10px] uppercase tracking-wider">{log.timestamp}</span>
                      <span className={`font-medium ${log.type === 'dialogue' ? 'text-amber-950 italic' : 'text-slate-900'}`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-amber-900/50 italic flex items-center gap-2 mt-4 justify-center">
                    <ScrollText size={12} /> End of records...
                  </div>
                </div>

                {/* DM Chat Input */}
                <div className="mt-2 pt-2 border-t-2 border-amber-900/20 flex gap-2">
                  <input
                    type="text"
                    placeholder="Message the Dungeon Master..."
                    className="flex-1 bg-[#eaddcf] border-2 border-[#855e42] text-amber-950 px-2 py-2 text-xs font-pixel focus:outline-none focus:border-amber-600 placeholder:text-amber-900/40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          useGameStore.getState().addLog({
                            id: Date.now(),
                            message: `You: ${target.value}`,
                            type: 'info',
                            timestamp: new Date().toLocaleTimeString()
                          });
                          target.value = '';
                        }
                      }
                    }}
                  />
                  <button className="bg-[#855e42] text-[#eaddcf] px-3 border-2 border-[#5c4b40] hover:bg-[#5c4b40] active:translate-y-1 transition-all">
                    ➤
                  </button>
                </div>
              </div>
            </PixelBox>
          </div>
        </div>

        {/* --- BOTTOM HUD: Party Roster Only --- */}
        <div className="w-full h-40 bg-[#1e1e24] border-t-4 border-slate-800 p-2 flex gap-2 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.5)] shrink-0">

          {/* PARTY ROSTER SECTION */}
          <PixelBox className="w-full" variant="wood" title="Party Roster">
            <div className="flex gap-2 h-full items-center justify-around overflow-hidden px-2">
              {party.map(agent => (
                <div
                  key={agent.id}
                  onClick={() => selectAgent(agent.id)}
                  className="flex-1 max-w-[100px] bg-[#4a3b32] border-2 border-[#2a1d17] hover:border-[#eaddcf] cursor-pointer p-2 flex flex-col items-center gap-1 group transition-all relative rounded shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Users size={10} className="text-white" />
                  </div>

                  {/* Portrait / Sprite */}
                  <div className="w-12 h-12 relative shrink-0">
                    <div
                      className="w-full h-full bg-no-repeat bg-contain bg-center drop-shadow-md"
                      style={{
                        backgroundImage: `url('/sprites/${agent.class === 'Warrior' ? 'warrior_sitting.png' :
                          agent.class === 'Mage' ? 'mage_sitting.png' :
                            'rogue_sitting.png'
                          }')`,
                        filter: `hue-rotate(${parseInt(agent.id.slice(-2), 16) * 10}deg)`
                      }}
                    />
                  </div>

                  <div className="text-[9px] text-[#eaddcf] truncate w-full text-center font-bold">{agent.name}</div>

                  {/* Bars */}
                  <div className="w-full space-y-1">
                    <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden border border-white/10">
                      <div style={{ width: `${(agent.stats.hp / agent.stats.maxHp) * 100}%` }} className="h-full bg-red-600"></div>
                    </div>
                    <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden border border-white/10">
                      <div style={{ width: `${(agent.stats.mp / agent.stats.maxMp) * 100}%` }} className="h-full bg-blue-500"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PixelBox>
        </div>

      </div>
    </main>
  );
}
