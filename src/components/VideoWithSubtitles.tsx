'use client';

import React, { useEffect, useState } from 'react';
import { CloudinaryPlayer } from './CloudinaryPlayer';
import { useSubtitleGeneration } from '@/hooks/useSubtitleGeneration';
import { Loader2 } from 'lucide-react';
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
    const [karaokeMode, setKaraokeMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const { subtitles, isGenerating, error, fetchExistingSubtitles, generateSubtitles } = useSubtitleGeneration();

    // Загрузка существующих субтитров при монтировании
    useEffect(() => {
        if (videoUrl) {
            fetchExistingSubtitles(videoUrl).then(existing => {
                if (!existing && autoGenerateSubtitles) {
                    generateSubtitles(videoUrl).catch(console.error);
                }
            });
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
        <div className="video-container space-y-4">
            <CloudinaryPlayer
                type="video"
                cloudinaryUrl={videoUrl}
                thumbnailUrl={thumbnailUrl}
                subtitles={subtitles}
                showSubtitles={showSubtitles}
                onTimeUpdate={setCurrentTime}
                karaokeMode={karaokeMode}
            />

            <div className="video-controls-panel flex flex-wrap items-center gap-4 p-4 bg-white/50 backdrop-blur-md rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSubtitles(!showSubtitles)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showSubtitles
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border'
                            }`}
                        title={showSubtitles ? 'Скрыть субтитры' : 'Показать субтитры'}
                    >
                        {showSubtitles ? '👁️ Subtitles On' : '🙈 Subtitles Off'}
                    </button>

                    <button
                        onClick={() => setKaraokeMode(!karaokeMode)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${karaokeMode
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border'
                            }`}
                        title={karaokeMode ? 'Выключить караоке' : 'Включить караоке'}
                    >
                        {karaokeMode ? '🎤 Karaoke Active' : '🎵 Karaoke Mode'}
                    </button>
                </div>

                <div className="flex-1 min-w-[200px]">
                    {subtitles.length > 0 ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold border border-green-100">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            {subtitles.length} Subtitles Synced
                        </div>
                    ) : !isGenerating && (
                        <button
                            onClick={handleGenerateSubtitles}
                            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            ✨ Generate AI Subtitles
                        </button>
                    )}

                    {isGenerating && (
                        <div className="flex items-center justify-center gap-3 py-2 px-4 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-100 italic">
                            <Loader2 className="size-3 animate-spin" />
                            Generating with AI...
                        </div>
                    )}
                </div>
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
