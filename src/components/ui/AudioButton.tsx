import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';
import { getAudioService } from '../../services/audioService';

interface AudioButtonProps {
    text: string;
    lang?: string;
    size?: 'sm' | 'default' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
    className?: string;
}

export function AudioButton({
    text,
    lang = 'en-US',
    size = 'sm',
    variant = 'ghost',
    className = ''
}: AudioButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioService = getAudioService();

    const handleClick = async () => {
        if (isPlaying) {
            audioService.stop();
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);
        try {
            await audioService.speak(text, lang);
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={`${className} ${isPlaying ? 'text-blue-600' : ''}`}
            title="Прослушать произношение"
        >
            {isPlaying ? (
                <VolumeX className="size-4" />
            ) : (
                <Volume2 className="size-4" />
            )}
        </Button>
    );
}
