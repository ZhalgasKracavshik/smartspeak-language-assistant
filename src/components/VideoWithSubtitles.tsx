'use client';

import React, { useEffect, useState } from 'react';
import { CloudinaryPlayer } from './CloudinaryPlayer';
import { useSubtitleGeneration } from '@/hooks/useSubtitleGeneration';
import '../styles/subtitles.css';

interface VideoWithSubtitlesProps {
    videoUrl: string;
    thumbnailUrl?: string;
    autoGenerateSubtitles?: boolean;
}

export function VideoWithSubtitles({
    videoUrl,
    thumbnailUrl,
    autoGenerateSubtitles = false,
}: VideoWithSubtitlesProps) {
    const [showSubtitles, setShowSubtitles] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const { subtitles, isGenerating, error, generateSubtitles } = useSubtitleGeneration();

    // Автоматическая генерация при монтировании
    useEffect(() => {
        if (autoGenerateSubtitles && videoUrl) {
            generateSubtitles(videoUrl).catch(console.error);
        }
    }, [videoUrl, autoGenerateSubtitles]);

    const handleGenerateSubtitles = async () => {
        try {
            await generateSubtitles(videoUrl);
        } catch (err) {
            console.error('Failed to generate subtitles:', err);
        }
    };

    return (
        <div className="video-container">
            <CloudinaryPlayer
                type="video"
                cloudinaryUrl={videoUrl}
                thumbnailUrl={thumbnailUrl}
                subtitles={subtitles}
                showSubtitles={showSubtitles}
                onTimeUpdate={setCurrentTime}
            />

            <div className="video-controls">
                {subtitles.length > 0 && (
                    <button
                        onClick={() => setShowSubtitles(!showSubtitles)}
                        className="subtitle-toggle-btn"
                    >
                        {showSubtitles ? '🙈 Скрыть субтитры' : '👁️ Показать субтитры'}
                    </button>
                )}

                {subtitles.length === 0 && !isGenerating && (
                    <button
                        onClick={handleGenerateSubtitles}
                        className="subtitle-generate-btn"
                        disabled={isGenerating}
                    >
                        ✨ Сгенерировать субтитры
                    </button>
                )}

                {isGenerating && (
                    <div className="subtitle-toggle-btn" style={{ opacity: 0.7 }}>
                        <span>Генерация субтитров...</span>
                        <span className="subtitle-loading">⏳</span>
                    </div>
                )}

                {subtitles.length > 0 && (
                    <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 600 }}>
                        ✅ {subtitles.length} субтитров загружено
                    </div>
                )}
            </div>

            {error && (
                <div className="subtitle-error">
                    ❌ Ошибка: {error}
                </div>
            )}

            {subtitles.length > 0 && (
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#64748b'
                }}>
                    💡 <strong>Подсказка:</strong> Субтитры будут автоматически появляться во время воспроизведения видео.
                    Время: {currentTime.toFixed(1)}s
                </div>
            )}
        </div>
    );
}
