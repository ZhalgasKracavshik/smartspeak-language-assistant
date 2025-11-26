'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { LyricsPlayer } from './LyricsPlayer';
import { LyricLine } from '../data/content';

interface MusicModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    title: string;
    lyrics: LyricLine[];
}

export function MusicModal({ isOpen, onClose, videoId, title, lyrics }: MusicModalProps) {
    if (!isOpen) return null;

    // Extract YouTube ID
    const cleanVideoId = videoId.length === 11 && !videoId.includes('/') && !videoId.includes('?')
        ? videoId
        : extractYouTubeId(videoId);

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

                {/* Lyrics Player */}
                <div className="flex-1 overflow-hidden">
                    <LyricsPlayer
                        videoId={cleanVideoId}
                        title={title}
                        thumbnail={`https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`}
                        lyrics={lyrics}
                    />
                </div>
            </motion.div>
        </div>
    );
}

function extractYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}
