"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useSprite } from './SpriteContext';
import { MATERIALS, getMaterial } from '../../lib/materialMap';

const PIXEL_SIZE = 12; // Size of editor grid cells
const GRID_SIZE = 64;

export default function PixelGrid() {
    const { asciiMap, updatePixel, selectedChar, showGrid, colors } = useSprite();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

    // Draw loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Checkerboard Background
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if ((x + y) % 2 === 0) {
                    ctx.fillStyle = '#1e1e1e';
                    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                } else {
                    ctx.fillStyle = '#262626';
                    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                }
            }
        }

        // Draw Pixels
        asciiMap.forEach((row, y) => {
            if (!row) return;
            for (let x = 0; x < row.length; x++) {
                const char = row[x];
                const mat = getMaterial(char);
                if (mat && mat.char !== '.') {
                    ctx.fillStyle = mat.getColor(colors);
                    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                }
            }
        });

        // Draw Grid Overlay
        if (showGrid) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let i = 0; i <= GRID_SIZE; i++) {
                // Vert
                ctx.moveTo(i * PIXEL_SIZE, 0);
                ctx.lineTo(i * PIXEL_SIZE, GRID_SIZE * PIXEL_SIZE);
                // Horz
                ctx.moveTo(0, i * PIXEL_SIZE);
                ctx.lineTo(GRID_SIZE * PIXEL_SIZE, i * PIXEL_SIZE);
            }
            ctx.stroke();
        }

        // Draw Hover
        if (hoverPos) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(hoverPos.x * PIXEL_SIZE, hoverPos.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }

    }, [asciiMap, showGrid, colors, hoverPos]);

    const handlePointer = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            setHoverPos({ x, y });
            if (e.buttons === 1) { // Left click held
                updatePixel(x, y, selectedChar);
            }
        }
    };

    return (
        <div className="overflow-auto bg-black flex-1 flex justify-center items-center p-8">
            <div className="relative shadow-2xl border border-neutral-700">
                <canvas
                    ref={canvasRef}
                    width={GRID_SIZE * PIXEL_SIZE}
                    height={GRID_SIZE * PIXEL_SIZE}
                    onMouseDown={handlePointer}
                    onMouseMove={handlePointer}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setHoverPos(null)}
                    className="cursor-crosshair"
                />
            </div>
        </div>
    );
}
