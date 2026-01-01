'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MediaWithSubtitles } from '../../../types/media';
import { CloudinaryPlayer } from '../../../components/CloudinaryPlayer';
import { SyncedLyrics } from '../../../components/SyncedLyrics';
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
    const [seekTime, setSeekTime] = React.useState<number | undefined>(undefined);

    const handleSeek = (time: number) => {
        setSeekTime(time);
        // Reset seekTime after a short delay so it can be triggered again for the same time
        setTimeout(() => setSeekTime(undefined), 100);
    };

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
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&?]*).*/;
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

            const { subtitles } = await response.json();

            if (!subtitles || subtitles.length === 0) {
                throw new Error('No subtitles were generated');
            }

            // Update media with new subtitles
            setMedia({
                ...media,
                subtitles: subtitles
            });

            setSubtitleError(null);
        } catch (err: any) {
            console.error('Error generating subtitles:', err);
            setSubtitleError(err.message || 'Failed to generate subtitles');
        } finally {
            setIsGeneratingSubtitles(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading content...</p>
                </div>
            </div>
        );
    }

    if (error || !media) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || 'Content not found'}</p>
                    <a href="/learning/content" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                        ← Back to Content Hub
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <a
                        href="/learning/content"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Back to Content Hub</span>
                    </a>
                </div>

                {/* Main Content Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Title Section */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">{media.type === 'video' ? '🎬' : '🎵'}</span>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{media.title}</h1>
                                <p className="text-blue-100 text-sm">{media.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                {media.difficulty}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                {media.category}
                            </span>
                            {media.duration && (
                                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                    {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Layout: Player and Lyrics Side by Side */}
                    <div className="p-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Player Section */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                                    <CloudinaryPlayer
                                        type={media.type}
                                        cloudinaryUrl={media.cloudinary_url}
                                        thumbnailUrl={media.thumbnail_url}
                                        onTimeUpdate={setCurrentTime}
                                        seekTime={seekTime}
                                    />
                                </div>

                                {/* Generate Subtitles Button */}
                                {media.subtitles.length === 0 &&
                                    !isGeneratingSubtitles &&
                                    !media.cloudinary_url.includes('youtube.com') &&
                                    !media.cloudinary_url.includes('youtu.be') && (
                                        <button
                                            onClick={handleGenerateSubtitles}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            ✨ Generate AI Subtitles
                                        </button>
                                    )}

                                {isGeneratingSubtitles && (
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                                            <p className="text-blue-800 font-medium">Generating subtitles...</p>
                                        </div>
                                    </div>
                                )}

                                {subtitleError && (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                                        <p className="text-red-800 text-sm">{subtitleError}</p>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                        <p className="text-blue-600 text-xs font-semibold mb-1">VIEWS</p>
                                        <p className="text-2xl font-bold text-gray-900">{media.view_count || 0}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                        <p className="text-purple-600 text-xs font-semibold mb-1">TYPE</p>
                                        <p className="text-2xl font-bold text-gray-900 capitalize">{media.type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Synchronized Lyrics Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Interactive Subtitles</h3>
                                </div>
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl max-h-[600px] overflow-y-auto">
                                    <SyncedLyrics
                                        subtitles={media.subtitles}
                                        currentTime={currentTime}
                                        onSeek={handleSeek}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
