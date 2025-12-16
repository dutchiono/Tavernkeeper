'use client';
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../lib/audio/SoundContext';
import { PixelButton } from '../PixelComponents';

export const VolumeControl: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { isMuted, toggleMute } = useSound();

    return (
        <PixelButton
            variant="wood"
            className={`p-2 ${className}`}
            onClick={toggleMute}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5 text-amber-900/50" />
            ) : (
                <Volume2 className="w-5 h-5 text-amber-900" />
            )}
        </PixelButton>
    );
};
