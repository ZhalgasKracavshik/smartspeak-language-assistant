'use client';

import React from 'react';
import Link from 'next/link';
import { MediaContent } from '@/types/media';
import { motion } from 'framer-motion';
import { Play, Eye, Clock } from 'lucide-react';

interface MediaCardProps {
    media: MediaContent;
}

export function MediaCard({ media }: MediaCardProps) {
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getDifficultyStyles = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'intermediate':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'advanced':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return '🎬';
            case 'audio': return '🎧';
            case 'song': return '🎵';
            case 'cartoon': return '🦄';
            case 'story': return '📚';
            case 'article': return '📄';
            default: return '📺';
        }
    };

    return (
        <Link href={`/content/${media.id}`}>
            <motion.div
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
            >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {media.thumbnail_url ? (
                        <img
                            src={media.thumbnail_url}
                            alt={media.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-purple-100 to-blue-100">
                            {getTypeIcon(media.type)}
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-8 h-8 text-purple-600 fill-purple-600" />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDuration(media.duration)}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-sm px-2.5 py-1 rounded-lg shadow-sm">
                        {getTypeIcon(media.type)}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {media.title}
                    </h3>

                    {media.description && (
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {media.description}
                        </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {media.difficulty && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getDifficultyStyles(media.difficulty)}`}>
                                {media.difficulty}
                            </span>
                        )}
                        {media.category && (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                {media.category}
                            </span>
                        )}
                    </div>

                    {/* Footer Stats */}
                    {media.view_count !== undefined && media.view_count > 0 && (
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm pt-3 border-t border-gray-100">
                            <Eye className="w-4 h-4" />
                            <span>{media.view_count.toLocaleString()} views</span>
                        </div>
                    )}
                </div>

                {/* Hover Border Gradient */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-400/50 transition-colors pointer-events-none" />
            </motion.div>
        </Link>
    );
}
