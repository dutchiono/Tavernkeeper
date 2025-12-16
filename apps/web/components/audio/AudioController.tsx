'use client';
import { useEffect } from 'react';
import { useGameStore } from '../../lib/stores/gameStore';
import { GameView } from '../../lib/types';
import { useSound } from '../../lib/audio/SoundContext';

export const AudioController: React.FC = () => {
    const { currentView } = useGameStore();
    const { playBGM, stopBGM } = useSound();

    useEffect(() => {
        // Map GameView to BGM tracks
        switch (currentView) {
            case GameView.INN:
            case GameView.CHAT:
                playBGM('INN');
                break;
            case GameView.MAP:
                playBGM('MAP');
                break;
            case GameView.BATTLE:
                playBGM('BATTLE');
                break;
            case GameView.CELLAR:
                playBGM('CELLAR');
                break;
            default:
                // No specific BGM for other views? Default to INN or stop?
                // playBGM('INN');
                break;
        }
    }, [currentView, playBGM]);

    return null;
};
