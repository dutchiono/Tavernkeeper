'use client';

import React, { useState, useRef } from 'react';
import { HeroClass } from '../lib/services/spriteService';

interface SpriteUploaderProps {
    onUpload: (file: File, heroClass: HeroClass) => Promise<void>;
}

export const SpriteUploader: React.FC<SpriteUploaderProps> = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [heroClass, setHeroClass] = useState<HeroClass>('Warrior');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            await onUpload(selectedFile, heroClass);
            setSelectedFile(null);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-[10px] text-[#d4c5b0] mb-2 uppercase font-bold tracking-wider">
                    Hero Class
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {(['Warrior', 'Mage', 'Rogue', 'Cleric'] as HeroClass[]).map(cls => (
                        <button
                            key={cls}
                            onClick={() => setHeroClass(cls)}
                            className={`px-2 py-2 border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                                heroClass === cls
                                    ? 'bg-amber-600 border-amber-800 text-white'
                                    : 'bg-[#3e2613] border-[#1e1209] text-[#a68b70] hover:bg-[#4e3019]'
                            }`}
                        >
                            <span className="text-[10px] uppercase font-bold tracking-wider">{cls}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-[#d4c5b0] mb-2 uppercase font-bold tracking-wider">
                    Upload Sprite
                </label>
                <div
                    className="border-2 border-dashed border-[#5c3a1e] p-8 text-center cursor-pointer hover:border-amber-500 transition-colors bg-[#2a1d17]"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    {preview ? (
                        <div className="space-y-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-w-full max-h-64 mx-auto"
                                style={{ imageRendering: 'pixelated' }}
                            />
                            <p className="text-xs text-[#8b7b63]">{selectedFile?.name}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-[#fcdfa6]">Click to select sprite image</p>
                            <p className="text-[10px] text-[#8b7b63]">PNG, JPEG, or GIF</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedFile && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full py-3 bg-[#8b5a2b] border-4 border-[#5c3a1e] text-[#fcdfa6] font-bold uppercase tracking-widest shadow-md hover:bg-[#9c6b3c] transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Uploading...' : 'Upload Sprite'}
                </button>
            )}
        </div>
    );
};

