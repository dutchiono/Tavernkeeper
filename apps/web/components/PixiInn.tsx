'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

interface PixiInnProps {
  width?: number;
  height?: number;
}

export default function PixiInn({ width = 800, height = 600 }: PixiInnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Pixi Application
    const pixiApp = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x2a2a2a, // Dark grey background
      antialias: false, // Keep pixel art crisp
      resolution: window.devicePixelRatio || 1,
    });

    containerRef.current.appendChild(pixiApp.view as unknown as Node);
    setApp(pixiApp);

    // Create a container for the scene
    const sceneContainer = new PIXI.Container();
    pixiApp.stage.addChild(sceneContainer);

    // Placeholder for Inn Background (Brown floor)
    const floor = new PIXI.Graphics();
    floor.beginFill(0x5d4037); // Wood brown
    floor.drawRect(0, 0, width, height);
    floor.endFill();
    sceneContainer.addChild(floor);

    // Placeholder for Tables
    const table = new PIXI.Graphics();
    table.beginFill(0x8d6e63); // Lighter wood
    table.drawRect(100, 200, 100, 60);
    table.endFill();
    sceneContainer.addChild(table);

    // Cleanup
    return () => {
      pixiApp.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [width, height]);

  return <div ref={containerRef} className="rounded-lg overflow-hidden border-4 border-slate-700 shadow-xl" />;
}
