'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimationType, drawSpriteFrame, HeroClass, HeroColors } from '../lib/services/spriteService';

interface SpritePreviewProps {
    type: HeroClass;
    colors: HeroColors;
    scale?: number;
    showFrame?: boolean;
    name?: string;
    subtitle?: string;
    interactive?: boolean;
}

export const SpritePreview: React.FC<SpritePreviewProps> = ({
    type,
    colors,
    scale = 5,
    showFrame = false,
    name,
    subtitle,
    interactive = true
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frameIndex, setFrameIndex] = useState(0);
    const [anim, setAnim] = useState<AnimationType>('idle');

    // Animation Loop
    useEffect(() => {
        if (!interactive) return;

        const interval = setInterval(() => {
            setFrameIndex(prev => prev + 1);
        }, 200);

        return () => clearInterval(interval);
    }, [anim, interactive]);

    // Drawing Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Determine grid size based on entity type to set canvas dimensions correctly
        const spriteSize = 64; // All sprites are 64x64

        canvas.width = spriteSize * scale;
        canvas.height = spriteSize * scale;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawSpriteFrame(ctx, type, colors, anim, frameIndex, scale, 0, 0, false);

    }, [type, colors, frameIndex, scale, anim]);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative inline-block group">
                {showFrame && (
                    <div className="absolute inset-4 border-2 border-[#8c7b63]/20 pointer-events-none" />
                )}
                <canvas
                    ref={canvasRef}
                    className="drop-shadow-2xl transition-transform duration-500"
                    style={{
                        imageRendering: 'pixelated'
                    }}
                />
                {/* Shadow underneath */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 rounded-[50%] blur-sm pointer-events-none" />
            </div>

            {/* Animation Controls - Only show if interactive */}
            {interactive && (
                <div className="flex gap-2 p-1 bg-[#2a1d17] rounded-full border border-[#5c3a1e]">
                    {(['idle', 'walk', 'emote'] as AnimationType[]).map(a => (
                        <button
                            key={a}
                            onClick={(e) => {
                                e.stopPropagation();
                                setAnim(a);
                                setFrameIndex(0);
                            }}
                            className={`
                            px-3 py-1 rounded-full text-[10px] uppercase font-bold transition-all
                            ${anim === a
                                    ? 'bg-amber-600 text-white shadow-md'
                                    : 'text-[#8b7b63] hover:text-[#fcdfa6] hover:bg-[#3e2613]'
                                }
                        `}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            )}

            {/* Name and Subtitle */}
            {name && (
                <div className="mt-2 text-center space-y-1 relative z-10 w-full">
                    <h3 className="text-xl font-bold text-[#3e3224] leading-tight break-words">{name}</h3>
                    {subtitle && (
                        <p className="text-[#8c7b63] text-[10px] uppercase tracking-widest mt-1">{subtitle}</p>
                    )}
                </div>
            )}
        </div>
    );
};

