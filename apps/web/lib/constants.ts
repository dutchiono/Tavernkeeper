import { Agent, CharacterClass, LogEntry } from './types';

export const INITIAL_PARTY: Agent[] = [
    {
        id: '1',
        name: 'Gromsh',
        class: CharacterClass.WARRIOR,
        level: 3,
        stats: { hp: 120, maxHp: 120, mp: 20, maxMp: 20, str: 18, int: 6, gold: 50 },
        traits: ['Brave', 'Gluttonous', 'Loyal'],
        backstory: 'A former royal guard who was fired for eating the king\'s roast boar.',
        currentThought: 'I wonder if that rat is edible...',
        inventory: ['Rusty Sword', 'Iron Shield', 'Ham Hock'],
        spriteColor: '#ef4444', // Red-500
        position: { x: 20, y: 60 },
        lastAction: 'Polishing shield'
    },
    {
        id: '2',
        name: 'Elara',
        class: CharacterClass.MAGE,
        level: 3,
        stats: { hp: 60, maxHp: 60, mp: 100, maxMp: 100, str: 6, int: 18, gold: 120 },
        traits: ['Curious', 'Arrogant', 'Bookworm'],
        backstory: 'Expelled from the academy for accidentally animating the library books.',
        currentThought: 'This scroll contains a typo on line 42.',
        inventory: ['Oak Staff', 'Spellbook', 'Mana Potion'],
        spriteColor: '#3b82f6', // Blue-500
        position: { x: 50, y: 55 },
        lastAction: 'Reading ancient texts'
    },
    {
        id: '3',
        name: 'Pip',
        class: CharacterClass.ROGUE,
        level: 2,
        stats: { hp: 80, maxHp: 80, mp: 40, maxMp: 40, str: 12, int: 12, gold: 200 },
        traits: ['Sneaky', 'Kleptomaniac', 'Lucky'],
        backstory: 'Grew up in the sewers. Likes shiny things a bit too much.',
        currentThought: 'Is that gold in the fireplace?',
        inventory: ['Daggers', 'Lockpick', 'Stolen Ring'],
        spriteColor: '#22c55e', // Green-500
        position: { x: 80, y: 65 },
        lastAction: 'Checking pockets'
    }
];

export const MOCK_LOGS: LogEntry[] = [
    { id: 1, message: 'Welcome to the Rusty Tankard Inn.', type: 'info', timestamp: '08:00' },
    { id: 2, message: 'Gromsh ordered a large ale.', type: 'dialogue', timestamp: '08:05' },
];
