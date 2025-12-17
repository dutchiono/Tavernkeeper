"use client";

import React from 'react';
import { SpriteProvider } from './SpriteContext';
import AsciiEditor from './AsciiEditor';
import PixelGrid from './PixelGrid';
import LivePreview from './LivePreview';
import MaterialPalette from './MaterialPalette';

import GeneratorPanel from '../ai/GeneratorPanel';

function EditorLayout() {
    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden relative">
            {/* LEFT: Material Palette */}
            <MaterialPalette />

            {/* MID-LEFT: ASCII Editor (Resizable later, fixed for now) */}
            <div className="w-96 h-full">
                <AsciiEditor />
            </div>

            {/* CENTER: Pixel Grid */}
            <PixelGrid />

            {/* AI PANEL (Floating) */}
            <GeneratorPanel />

            {/* RIGHT: Live Preview & Settings */}
            <LivePreview />
        </div>
    );
}

export default function SpriteWorkspace() {
    return (
        <SpriteProvider>
            <EditorLayout />
        </SpriteProvider>
    );
}
