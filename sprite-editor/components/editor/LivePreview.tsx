import React, { useRef, useEffect, useState } from 'react';
import { useSprite } from './SpriteContext';
import { drawSpriteFrame, generateSpriteURI, AnimationType, GENDERS, HERO_CLASSES, HeroColors, getFramesForEntity } from '../../lib/services/spriteService';

export default function LivePreview() {
    const { asciiMap, setAsciiMap, colors, setColors, heroClass, setHeroClass, gender, setGender } = useSprite();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [anim, setAnim] = useState<AnimationType>('idle');
    const [frame, setFrame] = useState(0);

    // Animation Loop
    useEffect(() => {
        let frameCount = 0;
        const interval = setInterval(() => {
            setFrame(f => f + 1);
        }, 200); // 5 FPS
        return () => clearInterval(interval);
    }, [anim]);

    // Render Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw
        // Using scale 4 for preview
        drawSpriteFrame(ctx, heroClass, colors, anim, frame, 4, 0, 0, false, asciiMap);

    }, [asciiMap, colors, heroClass, gender, anim, frame]); // Re-render on these changes

    return (
        <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-700 p-4 gap-6 overflow-auto w-80">

            {/* PREVIEW CANVAS */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-400 self-start">LIVE PREVIEW</h2>
                <div className="bg-neutral-800 border border-neutral-600 rounded p-4">
                    <canvas
                        ref={canvasRef}
                        width={256} // 64 * 4
                        height={256}
                    />
                </div>

                {/* CONTROLS */}
                <div className="flex gap-2">
                    {(['idle', 'walk', 'emote'] as const).map(a => (
                        <button
                            key={a}
                            onClick={() => setAnim(a)}
                            className={`px-3 py-1 text-xs rounded border ${anim === a ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 border-neutral-600 text-neutral-400 hover:text-white'}`}
                        >
                            {a.toUpperCase()}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            const uri = generateSpriteURI(heroClass, colors, false, asciiMap);
                            const link = document.createElement('a');
                            link.download = `${heroClass}_${Date.now()}.png`;
                            link.href = uri;
                            link.click();
                        }}
                        className="px-3 py-1 text-xs rounded border bg-emerald-700 border-emerald-600 text-white hover:bg-emerald-600"
                    >
                        SAVE
                    </button>
                </div>
            </div>

            {/* SETTINGS */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-neutral-500 font-bold uppercase">Class Base</label>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <select
                                value={HERO_CLASSES.includes(heroClass as any) ? heroClass : "Custom"}
                                onChange={(e) => {
                                    if (e.target.value !== "Custom") setHeroClass(e.target.value);
                                    else setHeroClass("Custom");
                                }}
                                className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm text-neutral-200 flex-1"
                            >
                                {HERO_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="Custom">Custom...</option>
                            </select>
                        </div>
                        {(!HERO_CLASSES.includes(heroClass as any) || heroClass === "Custom") && (
                            <input
                                type="text"
                                value={heroClass}
                                onChange={(e) => setHeroClass(e.target.value)}
                                placeholder="Enter class name..."
                                className="w-full bg-neutral-950 border border-blue-900 rounded px-2 py-1 text-xs text-blue-400 font-bold font-mono"
                            />
                        )}
                        <button
                            onClick={() => {
                                // Fetch the base map for the current class
                                // We pass undefined for customMap so it fetches the internal default
                                const frames = getFramesForEntity(heroClass, 'idle', false, undefined);
                                if (frames && frames[0]) {
                                    setAsciiMap(frames[0]);
                                }
                            }}
                            className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-600 uppercase font-bold"
                        >
                            Load Base Map
                        </button>
                    </div>
                </div>

                {/* COLORS */}
                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(colors) as Array<keyof typeof colors>).map((key) => (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-[10px] text-neutral-500 font-bold uppercase">{key}</label>
                            <div className="flex gap-2 items-center bg-neutral-800 border border-neutral-600 rounded px-2 py-1">
                                <input
                                    type="color"
                                    value={colors[key]}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setColors((prev: HeroColors) => ({ ...prev, [key]: val }));
                                    }}
                                    className="w-4 h-4 rounded-full border-none p-0 cursor-pointer bg-transparent"
                                />
                                <span className="text-xs font-mono text-neutral-400">{colors[key]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

// Helper to access internals
