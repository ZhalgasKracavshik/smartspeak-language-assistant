'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { MediaWithSubtitles } from '@/types/media';
import { CloudinaryPlayer } from '@/components/CloudinaryPlayer';
import { SyncedLyrics } from '@/components/SyncedLyrics';
import { ShadowingRecorder } from '@/components/ShadowingRecorder';
import '@/components/LyricsPlayer.css';

export default function MediaPlayerPage() {
    const params = useParams();
    const id = params.id as string;

    const [media, setMedia] = React.useState<MediaWithSubtitles | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [currentTime, setCurrentTime] = React.useState(0);

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
            setMedia(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching media:', err);
            setError('Failed to load media. Please try again.');
        } finally {
            setLoading(false);
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
