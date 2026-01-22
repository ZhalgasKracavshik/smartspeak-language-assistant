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
    seekTime?: number; // Add this to allow external seeking
    karaokeMode?: boolean;
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
    seekTime,
    karaokeMode = false,
}: CloudinaryPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const playerRef = useRef<any>(null);
    const karaokeScrollRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    // Check if this is a YouTube URL
    const youtubeVideoId = getYouTubeVideoId(cloudinaryUrl);

    useEffect(() => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;

        if (youtubeVideoId || !mediaElement) return;

        const handleTimeUpdate = () => {
            const time = mediaElement.currentTime;
            setCurrentTime(time);
            onTimeUpdate(time);

            // Find current subtitle
            if (subtitles.length > 0) {
                const current = subtitles.find(
                    sub => time >= sub.start_time && time <= sub.end_time
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
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                    onTimeUpdate(time);

                    // Find current subtitle (overlay only if requested)
                    if (subtitles.length > 0) {
                        const current = subtitles.find(
                            sub => time >= sub.start_time && time <= sub.end_time
                        );
                        setCurrentSubtitle(current || null);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }, 300); // Polling faster for karaoke smoothness

        return () => clearInterval(interval);
    }, [youtubeVideoId, type, onTimeUpdate, subtitles]);

    // Auto-scroll logic for karaoke
    useEffect(() => {
        if (karaokeMode && activeLineRef.current && karaokeScrollRef.current) {
            activeLineRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentSubtitle, karaokeMode]);

    const handleSeek = (time: number) => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;
        if (mediaElement) {
            mediaElement.currentTime = time;
        }
        if (playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(time, true);
        }
    };

    useEffect(() => {
        const mediaElement = type === 'video' ? videoRef.current : audioRef.current;
        if (seekTime !== undefined) {
            if (mediaElement) {
                mediaElement.currentTime = seekTime;
            }
            if (playerRef.current && playerRef.current.seekTo) {
                playerRef.current.seekTo(seekTime, true);
            }
        }
    }, [seekTime, type]);

    // Update playback speed when it changes

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
    };

    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    if (type === 'video') {
        // If it's a YouTube URL, render an iframe embed container for API
        return (
            <div className={`lyrics-player ${karaokeMode ? 'karaoke-active-layout' : ''}`}>
                <div className="media-and-karaoke-container flex flex-col lg:flex-row gap-6 bg-gray-950/50 p-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    {/* Media Container */}
                    <div className={`${karaokeMode ? 'lg:w-3/5' : 'w-full'} relative group transition-all duration-500`}>
                        {type === 'video' ? (
                            youtubeVideoId ? (
                                <div className="relative pt-[56.25%] w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                                    <div id="youtube-player-inline" className="absolute top-0 left-0 w-full h-full border-none" />
                                </div>
                            ) : (
                                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full aspect-video"
                                        src={cloudinaryUrl}
                                        poster={thumbnailUrl}
                                        controls
                                        controlsList="nodownload"
                                    />
                                </div>
                            )
                        ) : (
                            <div className="audio-player-wrapper p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/5 shadow-2xl flex flex-col items-center justify-center gap-6">
                                {thumbnailUrl && (
                                    <img src={thumbnailUrl} alt="Cover" className="size-48 rounded-xl shadow-2xl object-cover ring-4 ring-white/5" />
                                )}
                                <audio ref={audioRef} className="w-full" src={cloudinaryUrl} controls controlsList="nodownload" />
                            </div>
                        )}

                        {/* Standard Subtitle Overlay (Only if not in karaoke mode) */}
                        {showSubtitles && currentSubtitle && !karaokeMode && (
                            <div className="video-subtitle-overlay absolute bottom-12 left-0 right-0 p-4 pointer-events-none flex flex-col items-center gap-1 z-10 transition-all">
                                <span className="subtitle-text bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-lg font-medium shadow-xl border border-white/10 uppercase tracking-wide">
                                    {currentSubtitle.text_en}
                                </span>
                                {currentSubtitle.text_ru && (
                                    <span className="subtitle-translation bg-blue-600/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-light shadow-lg">
                                        {currentSubtitle.text_ru}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Karaoke Transcript Panel */}
                    {karaokeMode && (
                        <div className="lg:w-2/5 flex flex-col h-[300px] lg:h-[auto] min-h-[400px] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative backdrop-blur-md">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-purple-500 animate-pulse" />
                                    Interactive Transcript
                                </h4>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Sync Active</span>
                            </div>

                            <div
                                ref={karaokeScrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar scroll-smooth"
                            >
                                {subtitles.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">
                                        Waiting for subtitles...
                                    </div>
                                ) : (
                                    subtitles.map((sub, idx) => {
                                        const isActive = currentSubtitle?.id === sub.id;
                                        return (
                                            <div
                                                key={sub.id || idx}
                                                ref={isActive ? activeLineRef : null}
                                                onClick={() => handleSeek(sub.start_time)}
                                                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer border backdrop-blur-sm ${isActive
                                                    ? 'bg-gradient-to-br from-blue-600/90 to-purple-600/90 border-white/30 shadow-2xl scale-[1.02] active-karaoke-line'
                                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`flex flex-col items-center gap-1 mt-1 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                                                        <span className="text-[10px] font-mono leading-none">
                                                            {Math.floor(sub.start_time / 60)}:{(sub.start_time % 60).toFixed(0).padStart(2, '0')}
                                                        </span>
                                                        {isActive && <div className="h-12 w-0.5 bg-gradient-to-b from-white/40 to-transparent rounded-full" />}
                                                    </div>

                                                    <div className="flex-1 space-y-2">
                                                        <div className={`text-base leading-relaxed font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                            {isActive && sub.words ? (
                                                                <div className="flex flex-wrap gap-x-1.5 gap-y-1">
                                                                    {sub.words.map((w, wIdx) => {
                                                                        const isWordActive = currentTime >= w.start && currentTime <= w.end;
                                                                        return (
                                                                            <span
                                                                                key={wIdx}
                                                                                className={`inline-block transition-all duration-200 ${isWordActive
                                                                                        ? 'text-yellow-300 scale-110 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)] font-bold'
                                                                                        : ''
                                                                                    }`}
                                                                            >
                                                                                {w.word}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                sub.text_en
                                                            )}
                                                        </div>

                                                        {(sub.text_ru || sub.text_kz) && (
                                                            <p className={`text-sm leading-snug transition-opacity duration-300 ${isActive ? 'text-white/90 font-medium' : 'text-gray-500 opacity-60'}`}>
                                                                {sub.text_ru || sub.text_kz}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
