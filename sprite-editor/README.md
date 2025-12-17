# Sprite Editor

Standalone sprite editor tool for TavernKeeper. This tool allows you to:
- Preview and customize current ASCII-based sprites
- Upload new sprite images
- Compare current vs new sprites side-by-side
- Download sprites at different scales
- Manage a sprite library

## Setup

1. Install dependencies:
```bash
cd sprite-editor
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

The app will be available at http://localhost:6001

## Features

### Tab 1: Current Sprite Editor
- Preview current ASCII-based sprites with real-time color customization
- Select hero class (Warrior, Mage, Rogue, Cleric)
- Adjust colors for skin, hair, clothing, and accent
- Preview animations (idle, walk, emote)
- Download sprites at 1x, 2x, 4x, or 8x scale

### Tab 2: Upload New Sprite
- Upload PNG sprite images
- Assign to specific hero class
- Preview before uploading
- Files saved to `public/sprites/new/`

### Tab 3: Compare
- Side-by-side comparison of current ASCII sprite vs uploaded new sprite
- Zoom controls (1x to 10x)
- Grid overlay toggle
- Export comparison as image

### Tab 4: Library
- Grid view of all sprites (current + uploaded)
- Filter by class
- Quick preview of both versions

## File Structure

```
sprite-editor/
├── app/
│   ├── api/sprites/upload/route.ts  # Upload endpoint
│   ├── layout.tsx
│   ├── page.tsx                     # Main tabbed interface
│   └── globals.css
├── components/
│   ├── SpritePreview.tsx            # Canvas sprite preview
│   ├── ColorEditor.tsx              # Color picker
│   ├── SpriteDownloader.tsx         # Download functionality
│   ├── SpriteUploader.tsx           # File upload
│   └── ComparisonView.tsx          # Side-by-side comparison
├── lib/services/
│   └── spriteService.ts             # Sprite rendering logic
└── public/sprites/
    └── new/                          # Uploaded sprites
```

## Usage

1. **Editing Current Sprites**: Use the "Current Editor" tab to customize colors and download sprites
2. **Uploading New Sprites**: Use the "Upload New" tab to upload your custom sprite images
3. **Comparing**: Use the "Compare" tab to see current vs new sprites side-by-side
4. **Library**: Use the "Library" tab to view all sprites at once

## Notes

- This is a standalone tool - it doesn't affect the main TavernKeeper app
- Uploaded sprites are stored locally in `public/sprites/new/`
- All sprites are rendered at 64x64 base resolution
- Download scales: 1x (64px), 2x (128px), 4x (256px), 8x (512px)

