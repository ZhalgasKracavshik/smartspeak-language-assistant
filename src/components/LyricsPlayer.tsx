'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { LyricLine } from '@/types/media';
import { useLanguage } from '../contexts/LanguageContext';

interface LyricsPlayerProps {
    videoId: string;
    title: string;
    artist?: string;
    thumbnail: string;
    lyrics: LyricLine[];
}

export function LyricsPlayer({ videoId, title, artist, thumbnail, lyrics }: LyricsPlayerProps) {
    const { language } = useLanguage();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [activeLyricIndex, setActiveLyricIndex] = useState(0);
    const playerRef = useRef<any>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const activeLyricRef = useRef<HTMLDivElement>(null);

    // Initialize YouTube player
    useEffect(() => {
        if (!videoId) return;

        const loadYouTubeAPI = () => {
            if ((window as any).YT && (window as any).YT.Player) {
                initializePlayer();
                return;
            }

            (window as any).onYouTubeIframeAPIReady = () => {
                console.log('✅ YouTube API Ready for Lyrics');
                initializePlayer();
            };

            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            }
        };

        const initializePlayer = () => {
            setTimeout(() => {
                const playerElement = document.getElementById('lyrics-youtube-player');
                if (!playerElement || !(window as any).YT?.Player) {
                    console.error('❌ Player element or YT not ready');
                    return;
                }

                try {
                    console.log('🎵 Creating lyrics player for:', videoId);
                    playerRef.current = new (window as any).YT.Player('lyrics-youtube-player', {
                        height: '1',
                        width: '1',
                        videoId: videoId,
                        playerVars: {
                            autoplay: 1,
                            controls: 0,
                            disablekb: 1,
                            fs: 0,
                            modestbranding: 1,
                            playsinline: 1
                        },
                        events: {
                            onReady: (event: any) => {
                                console.log('✅ Lyrics player ready!');
                                playerRef.current = event.target;
                                setIsPlayerReady(true);
                                setIsPlaying(true);

                                // Get duration
                                const videoDuration = event.target.getDuration();
                                setDuration(videoDuration);
                                console.log('⏱️ Duration:', videoDuration);
                            },
                            onStateChange: (event: any) => {
                                console.log('🎵 State change:', event.data);
                                // 1 = playing, 2 = paused
                                setIsPlaying(event.data === 1);
                            },
                            onError: (event: any) => {
                                console.error('❌ Player error:', event.data);
                            }
                        }
                    });
                } catch (e) {
                    console.error('❌ Error creating lyrics player:', e);
                }
            }, 100);
        };

        loadYouTubeAPI();

        return () => {
            if (playerRef.current?.destroy) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.log('Cleanup error (safe to ignore)');
                }
            }
        };
    }, [videoId]);

    // Poll current time
    useEffect(() => {
        if (!isPlayerReady || !playerRef.current) return;

        const interval = setInterval(() => {
            if (playerRef.current?.getCurrentTime) {
                try {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                } catch (e) {
                    // Player not ready yet
                }
            }
        }, 100); // Poll every 100ms for smooth updates

        return () => clearInterval(interval);
    }, [isPlayerReady]);

    // Update active lyric based on current time
    useEffect(() => {
        if (lyrics.length === 0) return;

        let activeIndex = 0;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime >= lyrics[i].startTime) {
                activeIndex = i;
            } else {
                break;
            }
        }

        if (activeIndex !== activeLyricIndex) {
            setActiveLyricIndex(activeIndex);
        }
    }, [currentTime, lyrics, activeLyricIndex]);

    // Auto-scroll to active lyric
    useEffect(() => {
        if (activeLyricRef.current && lyricsContainerRef.current) {
            activeLyricRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [activeLyricIndex]);

    const handlePlayPause = () => {
        if (!playerRef.current || !isPlayerReady) return;

        try {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        } catch (e) {
            console.error('Play/pause error:', e);
        }
    };

    const handleMuteToggle = () => {
        if (!playerRef.current || !isPlayerReady) return;

        try {
            if (isMuted) {
                playerRef.current.unMute();
            } else {
                playerRef.current.mute();
            }
            setIsMuted(!isMuted);
        } catch (e) {
            console.error('Mute toggle error:', e);
        }
    };

    const handleLyricClick = (time: number) => {
        if (playerRef.current?.seekTo && isPlayerReady) {
            try {
                playerRef.current.seekTo(time, true);
                if (!isPlaying) {
                    playerRef.current.playVideo();
                }
            } catch (e) {
                console.error('Seek error:', e);
            }
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Hidden YouTube Player - must be in DOM for API */}
            <div id="lyrics-youtube-player" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}></div>

            {/* Album Art & Controls */}
            <div className="flex-shrink-0 p-8 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block mb-6"
                >
                    <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                </motion.div>

                <h2 className="text-2xl font-bold mb-1">{title}</h2>
                {artist && <p className="text-gray-400 mb-4">{artist}</p>}

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleMuteToggle}
                        className="text-white hover:bg-white/20"
                        disabled={!isPlayerReady}
                    >
                        {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePlayPause}
                        className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                        disabled={!isPlayerReady}
                    >
                        {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
                    </Button>
                </div>

                {/* Time Display */}
                <p className="text-sm text-gray-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </p>

                {!isPlayerReady && (
                    <p className="text-xs text-yellow-400 mt-2">Loading player...</p>
                )}
            </div>

            {/* Lyrics Section */}
            <div className="flex-1 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Volume2 className="size-5" />
                        {language === 'kz' ? 'Мәтін' : 'Текст'}
                    </h3>
                </div>

                <div
                    ref={lyricsContainerRef}
                    className="h-full overflow-y-auto px-6 py-4 space-y-4"
                >
                    <AnimatePresence>
                        {lyrics.map((lyric, index) => (
                            <motion.div
                                key={index}
                                ref={index === activeLyricIndex ? activeLyricRef : null}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleLyricClick(lyric.startTime)}
                                className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${index === activeLyricIndex
                                    ? 'bg-blue-600 scale-105 shadow-lg'
                                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                                    }`}
                            >
                                <p className={`text-lg font-medium mb-2 ${index === activeLyricIndex ? 'text-white' : 'text-gray-300'
                                    }`}>
                                    {lyric.text}
                                </p>
                                <p className={`text-sm ${index === activeLyricIndex ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {lyric.translation}
                                </p>
                                <span className="text-xs text-gray-600 mt-1 block">
                                    {formatTime(lyric.startTime)}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
