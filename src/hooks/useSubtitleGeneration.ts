'use client';

import { useState } from 'react';
import { Subtitle } from '@/types/subtitle';

export function useSubtitleGeneration() {
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSubtitles = async (videoUrl: string, language: 'en' | 'kz' | 'ru' = 'en') => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/subtitles/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl, language }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate subtitles');
            }

            const data = await response.json();
            setSubtitles(data.subtitles);
            return data.subtitles;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Subtitle generation error:', err);
            throw err;
        } finally {
            setIsGenerating(false);
        }
    };

    const clearSubtitles = () => {
        setSubtitles([]);
        setError(null);
    };

    return {
        subtitles,
        isGenerating,
        error,
        generateSubtitles,
        clearSubtitles,
    };
}
