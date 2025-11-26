'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MediaType } from '@/types/media';
import { Subtitle } from '@/types/subtitle';
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
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

    useEffect(() => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;

        if (!mediaElement) return;

        const handleTimeUpdate = () => {
            const currentTime = mediaElement.currentTime;
            onTimeUpdate(currentTime);

            // Find current subtitle
            if (subtitles.length > 0) {
                const current = subtitles.find(
                    sub => currentTime >= sub.startTime && currentTime <= sub.endTime
                );
                setCurrentSubtitle(current || null);
            }
        };

        mediaElement.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [type, onTimeUpdate, subtitles]);

    // Update playback speed when it changes
    useEffect(() => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;
        if (mediaElement) {
            mediaElement.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed, type]);

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
    };

    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    if (type === 'video') {
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
                            <span className="subtitle-text">{currentSubtitle.text}</span>
                            {currentSubtitle.translation?.ru && (
                                <span className="subtitle-translation">
                                    {currentSubtitle.translation.ru}
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
