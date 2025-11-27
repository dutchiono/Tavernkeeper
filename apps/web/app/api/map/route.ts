import { NextResponse } from 'next/server';
// import { loadMap, getAvailableMaps } from '@innkeeper/engine';

// Mock data to match the guide's structure since engine exports are missing/issues
const MOCK_MAPS = {
    'abandoned-cellar': {
        id: 'abandoned-cellar',
        name: 'The Abandoned Cellar',
        rooms: [
            { id: 'room-1', type: 'room', connections: ['room-2'] },
            { id: 'corridor-1', type: 'corridor', connections: ['room-1', 'room-2'] },
            { id: 'room-2', type: 'chamber', connections: ['room-1', 'room-3'] },
            { id: 'room-3', type: 'boss', connections: ['room-2'] }
        ]
    },
    'goblin-warren': {
        id: 'goblin-warren',
        name: 'The Goblin Warren',
        rooms: [
            { id: 'room-1', type: 'room', connections: ['room-2', 'room-3'] },
            { id: 'room-2', type: 'room', connections: ['room-1', 'room-4'] },
            { id: 'room-3', type: 'room', connections: ['room-1', 'room-4'] },
            { id: 'room-4', type: 'chamber', connections: ['room-2', 'room-3', 'room-5'] },
            { id: 'room-5', type: 'boss', connections: ['room-4'] }
        ]
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mapId = searchParams.get('id');

    if (!mapId) {
        // const maps = getAvailableMaps();
        const maps = Object.keys(MOCK_MAPS);
        return NextResponse.json({ maps });
    }

    try {
        // const map = loadMap(mapId);
        const map = MOCK_MAPS[mapId as keyof typeof MOCK_MAPS];
        if (!map) {
            return NextResponse.json({ error: 'Map not found' }, { status: 404 });
        }
        return NextResponse.json(map);
    } catch (error) {
        console.error('Error loading map:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
