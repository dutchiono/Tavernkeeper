'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HeroClass, HeroColors, drawSpriteFrame } from '../lib/services/spriteService';
import { SpritePreview } from './SpritePreview';

interface ComparisonViewProps {
    heroClass: HeroClass;
    colors: HeroColors;
    newSpriteUrl?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ heroClass, colors, newSpriteUrl }) => {
    const [zoom, setZoom] = useState(5);
    const [showGrid, setShowGrid] = useState(false);
    const currentCanvasRef = useRef<HTMLCanvasElement>(null);
    const newCanvasRef = useRef<HTMLCanvasElement>(null);

    // Draw current sprite
    useEffect(() => {
        const canvas = currentCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 64;
        canvas.width = size * zoom;
        canvas.height = size * zoom;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawSpriteFrame(ctx, heroClass, colors, 'idle', 0, zoom, 0, 0, false);

        // Draw grid if enabled
        if (showGrid) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= size; i++) {
                ctx.beginPath();
                ctx.moveTo(i * zoom, 0);
                ctx.lineTo(i * zoom, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * zoom);
                ctx.lineTo(canvas.width, i * zoom);
                ctx.stroke();
            }
        }
    }, [heroClass, colors, zoom, showGrid]);

    // Draw new sprite if available
    useEffect(() => {
        const canvas = newCanvasRef.current;
        if (!canvas || !newSpriteUrl) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            const size = 64;
            canvas.width = size * zoom;
            canvas.height = size * zoom;

            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw grid if enabled
            if (showGrid) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                for (let i = 0; i <= size; i++) {
                    ctx.beginPath();
                    ctx.moveTo(i * zoom, 0);
                    ctx.lineTo(i * zoom, canvas.height);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(0, i * zoom);
                    ctx.lineTo(canvas.width, i * zoom);
                    ctx.stroke();
                }
            }
        };
        img.src = newSpriteUrl;
    }, [newSpriteUrl, zoom, showGrid]);

    const exportComparison = () => {
        const canvas = document.createElement('canvas');
        const size = 64;
        const spacing = 20;
        canvas.width = (size * zoom) * 2 + spacing;
        canvas.height = size * zoom + 40; // Extra space for labels

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#1a120b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw current sprite
        const currentCanvas = currentCanvasRef.current;
        if (currentCanvas) {
            ctx.drawImage(currentCanvas, 0, 20);
            ctx.fillStyle = '#fcdfa6';
            ctx.font = '12px "Press Start 2P"';
            ctx.fillText('Current', 10, 15);
        }

        // Draw new sprite
        const newCanvas = newCanvasRef.current;
        if (newCanvas) {
            ctx.drawImage(newCanvas, size * zoom + spacing, 20);
            ctx.fillStyle = '#fcdfa6';
            ctx.fillText('New', size * zoom + spacing + 10, 15);
        }

        const link = document.createElement('a');
        link.download = `comparison-${heroClass}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-center">
                <label className="text-[10px] text-[#d4c5b0] uppercase font-bold tracking-wider">
                    Zoom:
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                />
                <span className="text-xs text-[#fcdfa6]">{zoom}x</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-3 py-2 border-2 transition-all ${
                        showGrid
                            ? 'bg-amber-600 border-amber-800 text-white'
                            : 'bg-[#3e2613] border-[#1e1209] text-[#a68b70] hover:bg-[#4e3019]'
                    }`}
                >
                    <span className="text-[10px] uppercase font-bold">Grid</span>
                </button>
                {newSpriteUrl && (
                    <button
                        onClick={exportComparison}
                        className="px-3 py-2 bg-green-600 border-2 border-green-800 text-white hover:bg-green-700 transition-all"
                    >
                        <span className="text-[10px] uppercase font-bold">Export</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-[#fcdfa6] text-center">Current (ASCII)</h3>
                    <div className="bg-[#2a1d17] p-4 rounded border border-[#5c3a1e] flex items-center justify-center">
                        <canvas
                            ref={currentCanvasRef}
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-[#fcdfa6] text-center">New (Uploaded)</h3>
                    <div className="bg-[#2a1d17] p-4 rounded border border-[#5c3a1e] flex items-center justify-center min-h-[320px]">
                        {newSpriteUrl ? (
                            <canvas
                                ref={newCanvasRef}
                                style={{ imageRendering: 'pixelated' }}
                            />
                        ) : (
                            <p className="text-xs text-[#8b7b63] text-center">Upload a new sprite to compare</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

