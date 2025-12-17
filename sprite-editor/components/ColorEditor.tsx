'use client';

import React from 'react';
import { HeroColors, DEFAULT_COLORS } from '../lib/services/spriteService';

interface ColorEditorProps {
    colors: HeroColors;
    onChange: (colors: HeroColors) => void;
}

export const ColorEditor: React.FC<ColorEditorProps> = ({ colors, onChange }) => {
    const handleColorChange = (part: keyof HeroColors, color: string) => {
        onChange({ ...colors, [part]: color });
    };

    const handleRandomize = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        onChange({
            skin: '#fdbcb4',
            hair: randomColor(),
            clothing: randomColor(),
            accent: randomColor(),
        });
    };

    const exportPalette = () => {
        const dataStr = JSON.stringify(colors, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `palette-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(colors).map(([part, color]) => (
                    <div key={part} className="flex flex-col items-center gap-2 bg-[#3e2613] p-3 border border-[#1e1209] shadow-inner rounded">
                        <span className="text-[10px] uppercase text-[#8b7b63] font-bold tracking-wide w-full text-center border-b border-[#1e1209]/50 pb-1">
                            {part}
                        </span>
                        <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors rounded">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(part as keyof HeroColors, e.target.value)}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer"
                            />
                        </div>
                        <span className="text-[8px] text-[#d4c5b0] font-mono">{color}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleRandomize}
                    className="flex-1 py-2 text-[10px] uppercase font-bold text-amber-500 hover:text-amber-300 hover:bg-[#3e2613] border border-dashed border-amber-900/50 rounded transition-colors"
                >
                    Randomize
                </button>
                <button
                    onClick={exportPalette}
                    className="flex-1 py-2 text-[10px] uppercase font-bold text-green-500 hover:text-green-300 hover:bg-[#3e2613] border border-dashed border-green-900/50 rounded transition-colors"
                >
                    Export JSON
                </button>
            </div>
        </div>
    );
};

