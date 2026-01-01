'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MediaType, Subtitle } from '../types/media';
import '../components/Improvements.css';
import '../styles/subtitles.css';

interface CloudinaryPlayerProps {
    type: MediaType;
    cloudinaryUrl: string;
    thumbnailUrl?: string;
    onTimeUpdate: (currentTime: number) => void;
    subtitles?: Subtitle[];
    showSubtitles?: boolean;
}

// Helper to detect YouTube URLs and extract video ID
function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    // If it's already a clean ID, return it
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export function CloudinaryPlayer({
    type,
    cloudinaryUrl,
    thumbnailUrl,
    onTimeUpdate,
    subtitles = [],
    showSubtitles = true,
}: CloudinaryPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const playerRef = useRef<any>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

    // Check if this is a YouTube URL
    const youtubeVideoId = getYouTubeVideoId(cloudinaryUrl);

    useEffect(() => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;

        if (youtubeVideoId || !mediaElement) return;

        const handleTimeUpdate = () => {
            const currentTime = mediaElement.currentTime;
            onTimeUpdate(currentTime);

            // Find current subtitle
            if (subtitles.length > 0) {
                const current = subtitles.find(
                    sub => currentTime >= sub.start_time && currentTime <= sub.end_time
                );
                setCurrentSubtitle(current || null);
            }
        };

        mediaElement.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [type, onTimeUpdate, subtitles, youtubeVideoId]);

    // YouTube Player Initialization
    useEffect(() => {
        if (!youtubeVideoId || type !== 'video') return;

        // Load YouTube IFrame API
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            if ((window as any).YT && (window as any).YT.Player) {
                playerRef.current = new (window as any).YT.Player('youtube-player-inline', {
                    videoId: youtubeVideoId,
                    playerVars: {
                        autoplay: 0,
                        rel: 0,
                        modestbranding: 1
                    },
                    events: {
                        onReady: () => {
                            // Player is ready
                        }
                    }
                });
            }
        };

        if ((window as any).YT && (window as any).YT.Player) {
            initPlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error('Error destroying YouTube player:', e);
                }
            }
        };
    }, [youtubeVideoId, type]);

    // YouTube Time Polling
    useEffect(() => {
        if (!youtubeVideoId || type !== 'video') return;

        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                try {
                    const currentTime = playerRef.current.getCurrentTime();
                    onTimeUpdate(currentTime);

                    // Find current subtitle (overlay only if requested)
                    if (subtitles.length > 0) {
                        const current = subtitles.find(
                            sub => currentTime >= sub.start_time && currentTime <= sub.end_time
                        );
                        setCurrentSubtitle(current || null);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [youtubeVideoId, type, onTimeUpdate, subtitles]);

    // Update playback speed when it changes
    useEffect(() => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;
        if (mediaElement) {
            mediaElement.playbackRate = playbackSpeed;
        }
        if (playerRef.current && playerRef.current.setPlaybackRate) {
            playerRef.current.setPlaybackRate(playbackSpeed);
        }
    }, [playbackSpeed, type]);

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
    };

    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    if (type === 'video') {
        // If it's a YouTube URL, render an iframe embed container for API
        if (youtubeVideoId) {
            return (
                <div className="lyrics-player video-container">
                    <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                        <div id="youtube-player-inline" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}></div>

                        {/* Subtitle Overlay for YouTube (using our localized translations) */}
                        {showSubtitles && currentSubtitle && (
                            <div className="video-subtitle-overlay">
                                <span className="subtitle-text">{currentSubtitle.text_en}</span>
                                {currentSubtitle.text_ru && (
                                    <span className="subtitle-translation">
                                        {currentSubtitle.text_ru}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Playback Speed Controls */}
                    <div className="playback-controls">
                        <span className="playback-controls__label">Speed:</span>
                        <div className="playback-controls__buttons">
                            {speedOptions.map((speed) => (
                                <button
                                    key={speed}
                                    className={`playback-speed-btn ${playbackSpeed === speed ? 'playback-speed-btn--active' : ''}`}
                                    onClick={() => handleSpeedChange(speed)}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // Standard Cloudinary video player
        return (
            <div className="lyrics-player video-container">
                <div style={{ position: 'relative' }}>
                    <video
                        ref={videoRef}
                        className="lyrics-player__video"
                        src={cloudinaryUrl}
                        poster={thumbnailUrl}
                        controls
                        controlsList="nodownload"
                    >
                        Your browser does not support the video tag.
                    </video>

                    {/* Subtitle Overlay */}
                    {showSubtitles && currentSubtitle && (
                        <div className="video-subtitle-overlay">
                            <span className="subtitle-text">{currentSubtitle.text_en}</span>
                            {currentSubtitle.text_ru && (
                                <span className="subtitle-translation">
                                    {currentSubtitle.text_ru}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Playback Speed Controls */}
                <div className="playback-controls">
                    <span className="playback-controls__label">Speed:</span>
                    <div className="playback-controls__buttons">
                        {speedOptions.map((speed) => (
                            <button
                                key={speed}
                                className={`playback-speed-btn ${playbackSpeed === speed ? 'playback-speed-btn--active' : ''}`}
                                onClick={() => handleSpeedChange(speed)}
                            >
                                {speed}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lyrics-player lyrics-player--audio">
            {thumbnailUrl && (
                <div className="lyrics-player__audio-thumbnail">
                    <img src={thumbnailUrl} alt="Album art" />
                </div>
            )}
            <audio
                ref={audioRef}
                className="lyrics-player__audio"
                src={cloudinaryUrl}
                controls
                controlsList="nodownload"
            >
                Your browser does not support the audio tag.
            </audio>

            {/* Playback Speed Controls */}
            <div className="playback-controls">
                <span className="playback-controls__label">Speed:</span>
                <div className="playback-controls__buttons">
                    {speedOptions.map((speed) => (
                        <button
                            key={speed}
                            className={`playback-speed-btn ${playbackSpeed === speed ? 'playback-speed-btn--active' : ''}`}
                            onClick={() => handleSpeedChange(speed)}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
