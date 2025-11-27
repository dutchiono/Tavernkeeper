import React, { useEffect, useState } from 'react';
import { PixelButton } from '../PixelComponents';
import { useGameStore } from '../../lib/stores/gameStore';

interface Room {
    id: string;
    name?: string;
    type: 'room' | 'corridor' | 'chamber' | 'boss';
    connections: string[];
}

interface DungeonMap {
    id: string;
    name: string;
    rooms: Room[];
}

export const MapScene: React.FC = () => {
    const [map, setMap] = useState<DungeonMap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMap = async () => {
            try {
                // Default to abandoned-cellar for now
                const res = await fetch('/api/map?id=abandoned-cellar');
                if (!res.ok) throw new Error('Failed to load map');
                const data = await res.json();
                setMap(data);
            } catch (err) {
                console.error(err);
                setError('Could not load map data');
            } finally {
                setLoading(false);
            }
        };

        fetchMap();
    }, []);

    if (loading) return <div className="w-full h-full flex items-center justify-center text-white font-pixel">Loading Map...</div>;
    if (error) return <div className="w-full h-full flex items-center justify-center text-red-500 font-pixel">{error}</div>;
    if (!map) return null;

    // Simple vertical layout for now, filtering for main rooms
    const mainRooms = map.rooms.filter(r => r.type !== 'corridor');

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col items-center py-8 relative overflow-hidden">
            <h2 className="text-amber-500 text-sm font-pixel mb-8 uppercase tracking-widest border-b border-amber-900/50 pb-2 w-full text-center">
                {map.name}
            </h2>

            {/* Vertical Node Line */}
            <div className="absolute left-1/2 top-20 bottom-32 w-1 bg-slate-700 -translate-x-1/2 z-0" />

            {/* Nodes */}
            <div className="flex flex-col gap-8 z-10 w-full max-w-[200px] items-center">
                {mainRooms.map((room, index) => {
                    // Mock status for visualization
                    const isCurrent = index === 0;
                    const isLocked = index > 1;
                    const isVisited = index === 0;

                    let icon = '⬜';
                    if (room.type === 'boss') icon = '💀';
                    if (room.type === 'chamber') icon = '📦';
                    if (index === 0) icon = '🚪';

                    return (
                        <div key={room.id} className="flex items-center gap-4 w-full group relative">
                            {/* Node Icon */}
                            <div className={`
                                w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl shadow-xl transition-all
                                ${isCurrent ? 'bg-amber-100 border-amber-400 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : ''}
                                ${isVisited ? 'bg-emerald-100 border-emerald-500 opacity-80' : ''}
                                ${isLocked ? 'bg-slate-800 border-slate-700 opacity-50 grayscale' : ''}
                            `}>
                                {icon}
                            </div>

                            {/* Label */}
                            <div className={`
                                bg-slate-950/90 border border-slate-700 px-3 py-2 rounded text-[10px] uppercase tracking-wide
                                ${isCurrent ? 'text-amber-400 border-amber-900' : 'text-slate-400'}
                            `}>
                                <div className="font-bold">{room.type}</div>
                                <div className="text-[8px] opacity-70 capitalize">{isLocked ? 'Locked' : 'Open'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Area */}
            <div className="mt-auto w-full px-8 pb-4">
                <PixelButton variant="primary" className="w-full py-4 text-lg shadow-lg animate-pulse">
                    🛡️ Enter Area
                </PixelButton>
            </div>
        </div>
    );
};
