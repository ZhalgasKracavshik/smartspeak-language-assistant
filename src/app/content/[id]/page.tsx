'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MediaWithSubtitles } from '../../../types/media';
import { CloudinaryPlayer } from '../../../components/CloudinaryPlayer';
import { SyncedLyrics } from '../../../components/SyncedLyrics';
import { ShadowingRecorder } from '../../../components/ShadowingRecorder';
import '../../../components/LyricsPlayer.css';

export default function MediaPlayerPage() {
    const params = useParams();
    const id = params.id as string;

    const [media, setMedia] = React.useState<MediaWithSubtitles | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [isGeneratingSubtitles, setIsGeneratingSubtitles] = React.useState(false);
    const [subtitleError, setSubtitleError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!id) return;

        fetchMedia();
    }, [id]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/media/${id}`);

            if (!response.ok) {
                throw new Error('Media not found');
            }

            const data = await response.json();

            // If it's a YouTube video and has no subtitles, try to fetch transcripts
            if (data.type === 'video' && (!data.subtitles || data.subtitles.length === 0)) {
                const youtubeId = getYouTubeVideoId(data.cloudinary_url);
                if (youtubeId) {
                    try {
                        const { fetchTranscript } = await import('../../../services/transcriptService');
                        const segments = await fetchTranscript(youtubeId, data.title, data.type);

                        // Convert segments to subtitles format
                        if (segments.length > 0 && !segments[0].text.includes('not available')) {
                            const youtubeSubtitles = segments.map((s, i) => ({
                                id: `yt-${i}`,
                                media_id: data.id,
                                start_time: s.startTime,
                                end_time: s.endTime,
                                text_en: s.text,
                                text_ru: '', // We don't have Russian for YT transcripts yet
                                words: []
                            }));
                            data.subtitles = youtubeSubtitles;
                        }
                    } catch (tsError) {
                        console.error('Failed to fetch YT transcript:', tsError);
                    }
                }
            }

            setMedia(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching media:', err);
            setError('Failed to load media. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    function getYouTubeVideoId(url: string): string | null {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const handleGenerateSubtitles = async () => {
        if (!media) return;

        setIsGeneratingSubtitles(true);
        setSubtitleError(null);

        try {
            const response = await fetch('/api/subtitles/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoUrl: media.cloudinary_url,
                    language: 'en'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate subtitles');
            }

            const data = await response.json();

            // Update media with new subtitles
            setMedia(prev => prev ? { ...prev, subtitles: data.subtitles } : null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setSubtitleError(errorMessage);
            console.error('Subtitle generation error:', err);
        } finally {
            setIsGeneratingSubtitles(false);
        }
    };

    const handleSeek = (time: number) => {
        console.log('Seek to:', time);
    };

    if (loading) {
        return (
            <div className="media-player-page">
                <div className="media-player-page__loading">
                    Loading media...
                </div>
            </div>
        );
    }

    if (error || !media) {
        return (
            <div className="media-player-page">
                <div className="media-player-page__error">
                    {error || 'Media not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="media-player-page">
            <div className="media-player-page__container">
                {/* Header */}
                <div className="media-player-page__header">
                    <a href="/content" className="media-player-page__back-btn">
                        ← Back to Content Hub
                    </a>

                    <h1 className="media-player-page__title">{media.title}</h1>

                    {media.description && (
                        <p className="media-player-page__description">{media.description}</p>
                    )}
                </div>

                {/* Main Content */}
                <div className="media-player-page__content">
                    {/* Player Section */}
                    <div className="media-player-page__player-section">
                        <h2 className="media-player-page__section-title">
                            {media.type === 'video' ? '🎬' : '🎵'} Player
                        </h2>
                        <CloudinaryPlayer
                            type={media.type}
                            cloudinaryUrl={media.cloudinary_url}
                            thumbnailUrl={media.thumbnail_url}
                            onTimeUpdate={setCurrentTime}
                        />

                        <ShadowingRecorder originalAudioUrl={media.cloudinary_url} />

                        {/* Generate Subtitles Button - Only for non-YouTube/Spotify */}
                        {media.subtitles.length === 0 &&
                            !isGeneratingSubtitles &&
                            !media.cloudinary_url.includes('youtube.com') &&
                            !media.cloudinary_url.includes('youtu.be') && (
                                <button
                                    onClick={handleGenerateSubtitles}
                                    className="subtitle-generate-btn"
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    ✨ Сгенерировать субтитры
                                </button>
                            )}

                        {isGeneratingSubtitles && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '8px',
                                color: '#6366f1',
                                fontWeight: '600'
                            }}>
                                ⏳ Генерируем субтитры... Это может занять несколько секунд.
                            </div>
                        )}

                        {subtitleError && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                fontWeight: '600'
                            }}>
                                ❌ Ошибка: {subtitleError}
                            </div>
                        )}

                        {media.subtitles.length > 0 && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '8px',
                                color: '#10b981',
                                fontWeight: '600'
                            }}>
                                ✅ Субтитры загружены: {media.subtitles.length} сегментов
                            </div>
                        )}
                    </div>

                    {/* Lyrics Section */}
                    <div className="media-player-page__lyrics-section">
                        <h2 className="media-player-page__section-title">
                            📝 Synchronized Lyrics
                        </h2>
                        <SyncedLyrics
                            subtitles={media.subtitles}
                            currentTime={currentTime}
                            onSeek={handleSeek}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
