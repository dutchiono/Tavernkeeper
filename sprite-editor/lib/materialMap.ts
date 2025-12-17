import { HeroColors } from "./services/spriteService";

export interface MaterialDef {
    char: string;
    name: string;
    category: 'Body' | 'Clothing' | 'Metal' | 'Misc';
    getColor: (colors: HeroColors) => string;
}

export const MATERIALS: MaterialDef[] = [
    // TRANSPARENT
    { char: '.', name: 'Empty', category: 'Misc', getColor: () => 'rgba(0,0,0,0)' },
    { char: 'X', name: 'Outline', category: 'Misc', getColor: () => '#000000' },

    // SKIN
    { char: 'S', name: 'Skin Base', category: 'Body', getColor: (c) => c.skin },
    { char: 's', name: 'Skin Dark', category: 'Body', getColor: (c) => c.skin }, // TODO: darken
    { char: 'Y', name: 'Skin Light', category: 'Body', getColor: (c) => c.skin }, // TODO: lighten

    // HAIR
    { char: 'H', name: 'Hair Base', category: 'Body', getColor: (c) => c.hair },

    // CLOTHING
    { char: 'C', name: 'Cloth Base', category: 'Clothing', getColor: (c) => c.clothing },
    { char: 'c', name: 'Cloth Dark', category: 'Clothing', getColor: (c) => c.clothing }, // TODO: darken
    { char: 'K', name: 'Cloth Light', category: 'Clothing', getColor: (c) => c.clothing }, // TODO: lighten

    // ACCENT
    { char: 'A', name: 'Accent Base', category: 'Clothing', getColor: (c) => c.accent },

    // METAL/WEAPONS
    { char: 'M', name: 'Metal Base', category: 'Metal', getColor: () => '#9ca3af' },
    { char: 'L', name: 'Metal Light', category: 'Metal', getColor: () => '#d1d5db' },
    { char: 'G', name: 'Gold', category: 'Metal', getColor: () => '#fbbf24' },
    { char: 'l', name: 'Leather/Wood', category: 'Metal', getColor: () => '#5c3a1e' },

    // SPECIAL
    { char: 'E', name: 'Eye Pupil', category: 'Body', getColor: () => '#000000' },
    { char: 'w', name: 'Eye White', category: 'Body', getColor: () => '#ffffff' },
    { char: 'r', name: 'Red/Mouth', category: 'Body', getColor: () => '#ef4444' },
];

export const getMaterial = (char: string): MaterialDef | undefined => {
    return MATERIALS.find(m => m.char === char);
};
