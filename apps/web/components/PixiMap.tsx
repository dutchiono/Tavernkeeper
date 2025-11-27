'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

interface PixiMapProps {
    width?: number;
    height?: number;
    mapData?: any; // To be typed properly later
}

export default function PixiMap({ width = 800, height = 600, mapData }: PixiMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [app, setApp] = useState<PIXI.Application | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const pixiApp = new PIXI.Application({
            width,
            height,
            backgroundColor: 0x1a1a1a, // Darker background for map
            antialias: false,
            resolution: window.devicePixelRatio || 1,
        });

        containerRef.current.appendChild(pixiApp.view as unknown as Node);
        setApp(pixiApp);

        const mapContainer = new PIXI.Container();
        pixiApp.stage.addChild(mapContainer);

        // Placeholder Map Grid
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x333333);

        // Draw grid
        const gridSize = 32;
        for (let x = 0; x < width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }

        // Draw some dummy rooms
        graphics.beginFill(0x444444);
        graphics.drawRect(gridSize * 2, gridSize * 2, gridSize * 3, gridSize * 3); // Room 1
        graphics.drawRect(gridSize * 8, gridSize * 4, gridSize * 4, gridSize * 4); // Room 2
        graphics.endFill();

        // Draw connection
        graphics.lineStyle(2, 0x666666);
        graphics.moveTo(gridSize * 5, gridSize * 3.5);
        graphics.lineTo(gridSize * 8, gridSize * 6);

        mapContainer.addChild(graphics);

        return () => {
            pixiApp.destroy(true, { children: true, texture: true, baseTexture: true });
        };
    }, [width, height, mapData]);

    return <div ref={containerRef} className="rounded-lg overflow-hidden border-4 border-slate-700 shadow-xl" />;
}
