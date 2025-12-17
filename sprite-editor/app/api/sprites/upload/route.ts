import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const heroClass = formData.get('heroClass') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Create sprites/new directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'sprites', 'new');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, that's fine
        }

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${heroClass}-${Date.now()}.png`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return URL path
        const url = `/sprites/new/${filename}`;

        return NextResponse.json({ url, filename });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

