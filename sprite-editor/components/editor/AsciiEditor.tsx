"use client";

import React, { useEffect, useState } from 'react';
import { useSprite } from './SpriteContext';

export default function AsciiEditor() {
    const { asciiMap, setAsciiMap } = useSprite();
    const [text, setText] = useState("");

    // Sync map to text when map changes (external update or load)
    useEffect(() => {
        setText(asciiMap.join('\n'));
    }, [asciiMap]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);

        // Parse back to array
        const lines = newText.split('\n');
        // Ensure 64x64 for safety if possible, or just pass what is there
        // For editor fluidity we just pass the lines. 
        // Validation happens elsewhere or we just render what we have.
        setAsciiMap(lines);
    };

    return (
        <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-700">
            <div className="p-2 border-b border-neutral-700 font-bold text-neutral-400 text-sm">
                ASCII MAP (64x64)
            </div>
            <textarea
                value={text}
                onChange={handleChange}
                className="flex-1 w-full p-4 bg-neutral-900 text-white font-mono text-[10px] leading-[10px] resize-none focus:outline-none whitespace-pre"
                spellCheck={false}
                style={{
                    fontFamily: "'Courier New', Courier, monospace", // Ensure strict monospace
                    whiteSpace: 'pre',
                    overflow: 'auto'
                }}
            />
        </div>
    );
}
