import React, { useState, useEffect } from 'react';
import { Agent } from '../../lib/types';
import { PixelBox, PixelButton } from '../PixelComponents';

interface BattleSceneProps {
    party: Agent[];
    onComplete: (success: boolean) => void;
}

export const BattleScene: React.FC<BattleSceneProps> = ({ party, onComplete }) => {
    const [turn, setTurn] = useState(0);
    const [enemyHp, setEnemyHp] = useState(100);
    const [battleLog, setBattleLog] = useState<string[]>(['A wild SLIME BLOCK appears!']);

    // Simulate Battle Loop
    useEffect(() => {
        if (enemyHp <= 0) {
            setTimeout(() => onComplete(true), 2000);
            return;
        }

        const timer = setTimeout(() => {
            const actor = party[turn % party.length];
            const damage = Math.floor(Math.random() * 20) + 10;

            // Update State
            setEnemyHp(prev => Math.max(0, prev - damage));
            setBattleLog(prev => [`${actor.name} attacks for ${damage} dmg!`, ...prev.slice(0, 3)]);
            setTurn(t => t + 1);

        }, 1500); // Slow turns for retro feel

        return () => clearTimeout(timer);
    }, [turn, party, enemyHp, onComplete]);

    return (
        <div className="w-full h-full bg-[#2a1d17] relative flex flex-col font-pixel">
            {/* Combat Viewport */}
            <div className="flex-1 relative overflow-hidden bg-[#1a120b] border-b-4 border-[#5c4033]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(#4a3b32 2px, transparent 2px)',
                    backgroundSize: '20px 20px'
                }} />

                {/* Enemy Side */}
                <div className="absolute top-1/4 left-10 flex flex-col items-center">
                    <div className={`w-32 h-32 bg-green-600 border-4 border-green-800 shadow-xl transition-all duration-100 relative ${enemyHp < 100 ? 'animate-bounce' : ''}`}>
                        <div className="absolute inset-0 border-4 border-green-400 opacity-50"></div>
                        <div className="w-8 h-8 bg-black/40 absolute top-8 left-6"></div>
                        <div className="w-8 h-8 bg-black/40 absolute top-8 right-6"></div>
                        <div className="w-16 h-4 bg-black/40 absolute bottom-6 left-8"></div>
                    </div>
                    <div className="mt-4 w-32 h-4 bg-[#2a1d17] border border-[#8c7b63] p-0.5">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${enemyHp}%` }} />
                    </div>
                    <span className="mt-2 text-[#eaddcf] text-xs uppercase tracking-widest drop-shadow-md">Slime Block Lv.5</span>
                </div>

                {/* Party Side */}
                <div className="absolute bottom-10 right-10 flex gap-6">
                    {party.map((agent, i) => (
                        <div key={agent.id} className={`transition-all duration-300 flex flex-col items-center gap-2 ${turn % party.length === i ? '-translate-y-4 scale-110' : ''}`}>
                            {/* PFP / Sprite */}
                            <div
                                className={`w-20 h-20 border-4 shadow-lg relative group ${turn % party.length === i ? 'border-yellow-400' : 'border-[#8c7b63]'}`}
                                style={{ backgroundColor: agent.spriteColor || '#5c4033' }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center text-[#eaddcf]/50 font-bold text-xs">
                                    {agent.class.substring(0, 3)}
                                </div>
                                {/* Selection Indicator */}
                                {turn % party.length === i && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">▼</div>
                                )}
                            </div>

                            {/* HP Bar */}
                            <div className="w-20 h-3 bg-[#2a1d17] border border-[#8c7b63] p-0.5">
                                <div
                                    className="h-full bg-green-600"
                                    style={{ width: `${(agent.stats.hp / agent.stats.maxHp) * 100}%` }}
                                />
                            </div>

                            <div className={`text-[10px] uppercase font-bold ${turn % party.length === i ? 'text-yellow-400' : 'text-[#eaddcf]'}`}>
                                {agent.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Battle UI Box */}
            <div className="h-1/3 bg-[#2a1d17] border-t-4 border-[#5c4033] p-4 flex gap-4">
                <PixelBox className="flex-1 text-xs leading-loose" title="Combat Log" variant="paper">
                    <div className="flex flex-col-reverse h-full overflow-hidden">
                        {battleLog.map((log, i) => (
                            <div key={i} className={`py-1 border-b border-amber-900/10 ${i === 0 ? 'text-amber-900 font-bold' : 'text-amber-900/60'}`}>
                                {i === 0 ? '> ' : ''}{log}
                            </div>
                        ))}
                    </div>
                </PixelBox>

                <div className="w-1/3 flex flex-col gap-2">
                    <PixelButton variant="primary" disabled className="w-full">Attack</PixelButton>
                    <PixelButton variant="secondary" disabled className="w-full">Magic</PixelButton>
                    <PixelButton variant="neutral" disabled className="w-full">Item</PixelButton>
                </div>
            </div>
        </div>
    );
};
