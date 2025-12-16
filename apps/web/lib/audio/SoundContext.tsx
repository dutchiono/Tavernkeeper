'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

// Define available sound assets
export const SOUNT_ASSETS = {
    BGM: {
        INN: '/sounds/bgm_universal.wav',
        BATTLE: '/sounds/bgm_universal.wav',
        MAP: '/sounds/bgm_universal.wav',
        CELLAR: '/sounds/bgm_universal.wav',
    },
    SFX: {
        CLICK: '/sounds/sfx_click.ogg',
        HOVER: '/sounds/sfx_hover.mp3',
        VICTORY: '/sounds/sfx_victory.mp3',
        DEFEAT: '/sounds/sfx_defeat.mp3',
        ATTACK: '/sounds/sfx_attack.mp3',
        COIN: '/sounds/sfx_coin.mp3',
    },
};

interface SoundContextType {
    isMuted: boolean;
    volume: number;
    toggleMute: () => void;
    setVolume: (vol: number) => void;
    playBGM: (track: keyof typeof SOUNT_ASSETS.BGM) => void;
    playSFX: (sfx: keyof typeof SOUNT_ASSETS.SFX) => void;
    stopBGM: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const currentBgmRef = useRef<Howl | null>(null);
    const currentBgmNameRef = useRef<string | null>(null);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const storedMute = localStorage.getItem('tk_sound_muted');
        const storedVol = localStorage.getItem('tk_sound_volume');

        if (storedMute !== null) setIsMuted(storedMute === 'true');
        if (storedVol !== null) setVolumeState(parseFloat(storedVol));
    }, []);

    // Update Howler global mute/volume
    useEffect(() => {
        Howler.mute(isMuted);
        Howler.volume(volume);

        localStorage.setItem('tk_sound_muted', String(isMuted));
        localStorage.setItem('tk_sound_volume', String(volume));
    }, [isMuted, volume]);

    const setVolume = (vol: number) => {
        const newVol = Math.max(0, Math.min(1, vol));
        setVolumeState(newVol);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const playBGM = (trackName: keyof typeof SOUNT_ASSETS.BGM) => {
        const src = SOUNT_ASSETS.BGM[trackName];

        // If playing the same track, do nothing
        if (currentBgmNameRef.current === trackName && currentBgmRef.current?.playing()) {
            return;
        }

        // Fade out current track
        if (currentBgmRef.current) {
            const oldBgm = currentBgmRef.current;
            oldBgm.fade(volume, 0, 1000);
            setTimeout(() => {
                oldBgm.stop();
                oldBgm.unload();
            }, 1000);
        }

        // Start new track
        const newBgm = new Howl({
            src: [src],
            loop: true,
            volume: 0, // Start silent for fade in
            html5: true, // Force HTML5 Audio to fetch large files
            onloaderror: (id: number, err: unknown) => console.warn(`[Sound] Failed to load BGM ${trackName}:`, err),
            onplayerror: (id: number, err: unknown) => console.warn(`[Sound] Failed to play BGM ${trackName}:`, err),
        });

        newBgm.play();
        newBgm.fade(0, volume * 0.8, 1000); // Fade in to 80% of global volume (BGM usually quieter)

        currentBgmRef.current = newBgm;
        currentBgmNameRef.current = trackName;
    };

    const stopBGM = () => {
        if (currentBgmRef.current) {
            currentBgmRef.current.fade(volume, 0, 1000);
            setTimeout(() => {
                currentBgmRef.current?.stop();
                currentBgmRef.current = null;
                currentBgmNameRef.current = null;
            }, 1000);
        }
    };

    const playSFX = (sfxName: keyof typeof SOUNT_ASSETS.SFX) => {
        const src = SOUNT_ASSETS.SFX[sfxName];
        const sfx = new Howl({
            src: [src],
            volume: volume, // Full global volume for SFX
            onloaderror: (id: number, err: unknown) => console.warn(`[Sound] Failed to load SFX ${sfxName}:`, err),
        });
        sfx.play();
    };

    return (
        <SoundContext.Provider value={{ isMuted, volume, toggleMute, setVolume, playBGM, playSFX, stopBGM }}>
            {children}
        </SoundContext.Provider>
    );
};
