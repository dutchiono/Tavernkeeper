import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeroClass, Gender, HERO_CLASSES, GENDERS, DEFAULT_COLORS, HeroColors } from '../../lib/services/spriteService';

// Default empty map (64x64)
const createEmptyMap = () => Array(64).fill(".".repeat(64));

interface SpriteContextType {
    // Sprite Data
    asciiMap: string[];
    setAsciiMap: (map: string[]) => void;
    updatePixel: (x: number, y: number, char: string) => void;

    // Metadata
    heroClass: string;
    setHeroClass: (c: string) => void;
    gender: Gender;
    setGender: (g: Gender) => void;
    colors: HeroColors;
    setColors: (c: React.SetStateAction<HeroColors>) => void; // Allow functional updates

    // Editor State
    selectedChar: string; // The character we are painting with (e.g., 'S', 'M', '.')
    setSelectedChar: (char: string) => void;
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
}

const SpriteContext = createContext<SpriteContextType | undefined>(undefined);

export function SpriteProvider({ children }: { children: React.ReactNode }) {
    const [asciiMap, setAsciiMap] = useState<string[]>(createEmptyMap());
    const [heroClass, setHeroClass] = useState<string>('Warrior');
    const [gender, setGender] = useState<Gender>('Male');
    const [colors, setColors] = useState<HeroColors>(DEFAULT_COLORS);
    const [selectedChar, setSelectedChar] = useState<string>('S'); // Default to Skin
    const [showGrid, setShowGrid] = useState<boolean>(true);

    const updatePixel = (x: number, y: number, char: string) => {
        setAsciiMap(prev => {
            const newMap = [...prev];
            if (y >= 0 && y < 64 && x >= 0 && x < 64) {
                const row = newMap[y].split('');
                row[x] = char;
                newMap[y] = row.join('');
            }
            return newMap;
        });
    };

    return (
        <SpriteContext.Provider value={{
            asciiMap,
            setAsciiMap,
            updatePixel,
            heroClass,
            setHeroClass,
            gender,
            setGender,
            colors,
            setColors,
            selectedChar,
            setSelectedChar,
            showGrid,
            setShowGrid
        }}>
            {children}
        </SpriteContext.Provider>
    );
}

export function useSprite() {
    const context = useContext(SpriteContext);
    if (context === undefined) {
        throw new Error('useSprite must be used within a SpriteProvider');
    }
    return context;
}
