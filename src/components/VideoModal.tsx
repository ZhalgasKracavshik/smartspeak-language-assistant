'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { fetchTranscript, TranscriptSegment, findActiveSegment } from '../services/transcriptService';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    title: string;
}

export function VideoModal({ isOpen, onClose, videoId, title }: VideoModalProps) {
    const { language } = useLanguage();
    const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
    const [showTranscript, setShowTranscript] = useState(true);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    const activeSegmentRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    const isSpotify = videoId.startsWith('spotify:');

    // Extract clean video ID for YouTube
    const cleanVideoId = isSpotify ? videoId : extractYouTubeId(videoId);

    // Load transcript on mount
    useEffect(() => {
        if (!isOpen || !cleanVideoId) return;

        const loadTranscript = async () => {
            setIsLoadingTranscript(true);
            try {
                // Determine content type based on videoId
                const contentType = isSpotify ? 'song' : 'video';
                const segments = await fetchTranscript(cleanVideoId, title, contentType);
                setTranscript(segments);
            } catch (error) {
                console.error('Failed to load transcript:', error);
            } finally {
                setIsLoadingTranscript(false);
            }
        };

        loadTranscript();
    }, [isOpen, cleanVideoId, title, isSpotify]);

    // Initialize YouTube player
    useEffect(() => {
        if (!isOpen || isSpotify || !cleanVideoId) return;

        // Load YouTube IFrame API
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Initialize player when API is ready
        const initPlayer = () => {
            if ((window as any).YT && (window as any).YT.Player) {
                playerRef.current = new (window as any).YT.Player('youtube-player', {
                    videoId: cleanVideoId,
                    playerVars: {
                        autoplay: 1,
                        rel: 0
                    }
                });
            }
        };

        if ((window as any).YT) {
            initPlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error('Error destroying player:', e);
                }
            }
        };
    }, [isOpen, cleanVideoId, isSpotify]);

    // Poll playback time for YouTube
    useEffect(() => {
        if (!isOpen || isSpotify || !playerRef.current) return;

        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                try {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                } catch (e) {
                    // Player might not be ready yet
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isOpen, isSpotify]);

    // Update active segment based on current time
    useEffect(() => {
        if (transcript.length === 0) return;
        const index = findActiveSegment(transcript, currentTime);
        setActiveSegmentIndex(index);
    }, [currentTime, transcript]);

    // Auto-scroll to active segment
    useEffect(() => {
        if (activeSegmentRef.current && transcriptContainerRef.current && showTranscript) {
            activeSegmentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [activeSegmentIndex, showTranscript]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 className="text-white font-medium text-lg line-clamp-1 flex-1 mr-4">{title}</h3>
                    <div className="flex items-center gap-2">
                        {transcript.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTranscript(!showTranscript)}
                                className="text-white hover:bg-white/20"
                            >
                                <Volume2 className="size-4 mr-2" />
                                {showTranscript ? (language === 'kz' ? 'Жасыру' : 'Скрыть') : (language === 'kz' ? 'Көрсету' : 'Показать')}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <X className="size-6" />
                        </Button>
                    </div>
                </div>

                {/* Main Content: Video + Transcript */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Video Player */}
                    <div className={`${showTranscript && transcript.length > 0 ? 'lg:w-2/3' : 'w-full'} bg-black flex items-center justify-center`}>
                        {isSpotify ? (
                            <iframe
                                style={{ borderRadius: '0' }}
                                src={`https://open.spotify.com/embed/${videoId.split(':')[1]}/${videoId.split(':')[2]}?utm_source=generator`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="min-h-[400px]"
                            ></iframe>
                        ) : (
                            <div id="youtube-player" className="w-full aspect-video"></div>
                        )}
                    </div>

                    {/* Transcript Panel */}
                    {showTranscript && transcript.length > 0 && (
                        <div className="lg:w-1/3 bg-gray-800 flex flex-col max-h-[500px] lg:max-h-none">
                            <div className="p-4 border-b border-gray-700">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                    <Volume2 className="size-5" />
                                    {language === 'kz' ? 'Транскрипт' : 'Транскрипт'}
                                </h4>
                            </div>

                            <div
                                ref={transcriptContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-3"
                            >
                                {isLoadingTranscript ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="size-8 text-blue-500 animate-spin" />
                                    </div>
                                ) : (
                                    transcript.map((segment, index) => (
                                        <div
                                            key={index}
                                            ref={index === activeSegmentIndex ? activeSegmentRef : null}
                                            className={`p-3 rounded-lg transition-all cursor-pointer ${index === activeSegmentIndex
                                                    ? 'bg-blue-600 text-white scale-105 shadow-lg'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                            onClick={() => {
                                                if (playerRef.current && playerRef.current.seekTo) {
                                                    playerRef.current.seekTo(segment.startTime, true);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="text-xs opacity-70 mt-1">
                                                    {formatTime(segment.startTime)}
                                                </span>
                                                <p className="flex-1 text-sm leading-relaxed">
                                                    {segment.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function extractYouTubeId(url: string): string {
    // If it's already a clean ID, return it
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }

    // Extract from URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
