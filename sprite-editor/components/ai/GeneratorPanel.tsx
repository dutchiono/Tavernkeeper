"use client";

import React, { useState } from 'react';
import { useSprite } from '../editor/SpriteContext';

export default function GeneratorPanel() {
    const { setAsciiMap } = useSprite();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);

        // MOCK AI GENERATION for now
        // In a real app, this would call an API route that prompts an LLM to return a 64x64 string array
        setTimeout(() => {
            const newMap = Array(64).fill(".".repeat(64)).map((row, y) => {
                // Simple circle shape to prove it changes
                const center = 32;
                const radius = 16;
                const dist = Math.sqrt(Math.pow(y - center, 2) + Math.pow(32 - center, 2)); // Just a vertical stripe effectively? 
                // Logic for circle: (x-h)^2 + (y-k)^2 < r^2
                let newRow = "";
                for (let x = 0; x < 64; x++) {
                    const d = Math.sqrt(Math.pow(x - 32, 2) + Math.pow(y - 32, 2));
                    if (d < 10) newRow += "S"; // Skin
                    else if (d < 12) newRow += "X"; // Outline
                    else if (d < 20 && d > 18) newRow += "M"; // Metal ring
                    else newRow += ".";
                }
                return newRow;
            });

            setAsciiMap(newMap);
            setIsGenerating(false);
        }, 1000);
    };

    return (
        <div className="absolute bottom-4 left-4 z-10 bg-neutral-900 border border-neutral-700 p-4 rounded-lg shadow-xl w-80">
            <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">AI Draft Station</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a sprite (e.g. 'A dwarf holding a large axe')"
                className="w-full bg-neutral-950 text-white text-sm p-2 rounded border border-neutral-800 mb-2 h-20 resize-none focus:outline-none focus:border-blue-600"
            />
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold py-2 rounded text-xs uppercase tracking-wider transaction-colors"
            >
                {isGenerating ? 'Drafting...' : 'Generate Base'}
            </button>
            <div className="text-[10px] text-neutral-600 mt-2 text-center">
                * Generates raw ASCII structure for you to refine.
            </div>
        </div>
    );
}
