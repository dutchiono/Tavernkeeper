'use client';

import React, { useState } from 'react';
import { HeroClass, HeroColors, generateSpriteURI } from '../lib/services/spriteService';

interface SpriteDownloaderProps {
    heroClass: HeroClass;
    colors: HeroColors;
}

export const SpriteDownloader: React.FC<SpriteDownloaderProps> = ({ heroClass, colors }) => {
    const [scale, setScale] = useState(8);

    const downloadSprite = (exportScale: number) => {
        const dataUri = generateSpriteURI(heroClass, colors, false);

        // If we need a different scale, regenerate
        if (exportScale !== 8) {
            const canvas = document.createElement('canvas');
            const size = 64;
            canvas.width = size * exportScale;
            canvas.height = size * exportScale;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.imageSmoothingEnabled = false;

            // Load the 8x image and scale it
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const scaledDataUri = canvas.toDataURL('image/png');
                triggerDownload(scaledDataUri, exportScale);
            };
            img.src = dataUri;
        } else {
            triggerDownload(dataUri, exportScale);
        }
    };

    const triggerDownload = (dataUri: string, exportScale: number) => {
        const link = document.createElement('a');
        const colorsHash = Object.values(colors).join('-').replace(/#/g, '');
        link.download = `${heroClass}-${colorsHash.substring(0, 20)}-${exportScale}x.png`;
        link.href = dataUri;
        link.click();
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-[10px] text-[#d4c5b0] mb-2 uppercase font-bold tracking-wider">
                    Export Scale
                </label>
                <div className="flex gap-2">
                    {[1, 2, 4, 8].map(s => (
                        <button
                            key={s}
                            onClick={() => setScale(s)}
                            className={`px-3 py-2 border-2 transition-all ${
                                scale === s
                                    ? 'bg-amber-600 border-amber-800 text-white'
                                    : 'bg-[#3e2613] border-[#1e1209] text-[#a68b70] hover:bg-[#4e3019]'
                            }`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={() => downloadSprite(scale)}
                className="w-full py-3 bg-[#8b5a2b] border-4 border-[#5c3a1e] text-[#fcdfa6] font-bold uppercase tracking-widest shadow-md hover:bg-[#9c6b3c] transition-all active:scale-[0.99]"
            >
                Download Sprite ({scale}x)
            </button>
        </div>
    );
};

