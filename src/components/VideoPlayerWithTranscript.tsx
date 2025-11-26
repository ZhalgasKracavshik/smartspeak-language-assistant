'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { fetchTranscript, TranscriptSegment, findActiveSegment } from '../services/transcriptService';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoPlayerWithTranscriptProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    title: string;
    type: 'video' | 'song' | 'cartoon';
}

export function VideoPlayerWithTranscript({
    isOpen,
    onClose,
    videoId,
    title,
    type
}: VideoPlayerWithTranscriptProps) {
    const { language } = useLanguage();
    const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    const activeSegmentRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    const isSpotify = videoId.startsWith('spotify:');

    // Load transcript on mount
    useEffect(() => {
        if (!isOpen) return;

        const loadTranscript = async () => {
            setIsLoadingTranscript(true);
            try {
                const segments = await fetchTranscript(videoId, title, type);
                setTranscript(segments);
            } catch (error) {
                console.error('Failed to load transcript:', error);
            } finally {
                setIsLoadingTranscript(false);
            }
        };

        loadTranscript();
    }, [isOpen, videoId, title, type]);

    // Initialize YouTube player
    useEffect(() => {
        if (!isOpen || isSpotify) return;

        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Initialize player when API is ready
        (window as any).onYouTubeIframeAPIReady = () => {
            playerRef.current = new (window as any).YT.Player('youtube-player', {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    rel: 0
                },
                events: {
                    onReady: () => {

                    }
                }
            });
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [isOpen, videoId, isSpotify]);

    // Poll playback time for YouTube
    useEffect(() => {
        if (!isOpen || isSpotify || !playerRef.current) return;

        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                const time = playerRef.current.getCurrentTime();
                setCurrentTime(time);
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
        if (activeSegmentRef.current && transcriptContainerRef.current) {
            activeSegmentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [activeSegmentIndex]);

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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full"
                    >
                        <X className="size-6" />
                    </Button>
                </div>

                {/* Main Content: Video + Transcript */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Video Player */}
                    <div className="lg:w-2/3 bg-black flex items-center justify-center">
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
                    <div className="lg:w-1/3 bg-gray-800 flex flex-col">
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
                            ) : transcript.length === 0 ? (
                                <div className="text-gray-400 text-center">
                                    {language === 'kz'
                                        ? 'Транскрипт қолжетімді емес'
                                        : 'Транскрипт недоступен'}
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
                </div>
            </motion.div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
