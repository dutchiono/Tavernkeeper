"use client";

import React from 'react';
import { useSprite } from './SpriteContext';
import { MATERIALS } from '../../lib/materialMap';

export default function MaterialPalette() {
    const { selectedChar, setSelectedChar, colors } = useSprite();

    // Group by category
    const categories = Array.from(new Set(MATERIALS.map(m => m.category)));

    return (
        <div className="w-16 bg-neutral-900 border-r border-neutral-700 flex flex-col items-center py-4 gap-4 overflow-auto">
            {categories.map(cat => (
                <div key={cat} className="flex flex-col gap-1 items-center w-full">
                    <div className="text-[9px] text-neutral-500 font-bold uppercase mb-1">{cat}</div>
                    {MATERIALS.filter(m => m.category === cat).map(mat => (
                        <button
                            key={mat.char}
                            onClick={() => setSelectedChar(mat.char)}
                            title={`${mat.name} (${mat.char})`}
                            className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs relative group ${selectedChar === mat.char ? 'border-white ring-1 ring-white' : 'border-neutral-700 hover:border-neutral-500'}`}
                            style={{ backgroundColor: mat.getColor(colors) }}
                        >
                            <span className="drop-shadow-md text-white font-bold" style={{ textShadow: '0 1px 1px black' }}>
                                {mat.char}
                            </span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
