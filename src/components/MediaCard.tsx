'use client';

import React from 'react';
import Link from 'next/link';
import { MediaContent } from '@/types/media';
import { motion } from 'framer-motion';

interface MediaCardProps {
    media: MediaContent;
}

export function MediaCard({ media }: MediaCardProps) {
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getDifficultyColor = (difficulty?: string): string => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-500';
            case 'intermediate':
                return 'bg-yellow-500';
            case 'advanced':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Link href={`/content/${media.id}`}>
            <motion.div
                className="media-card"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                {/* Thumbnail */}
                <div className="media-card__thumbnail">
                    {media.thumbnail_url ? (
                        <img
                            src={media.thumbnail_url}
                            alt={media.title}
                            className="media-card__image"
                        />
                    ) : (
                        <div className="media-card__placeholder">
                            {media.type === 'video' ? '🎬' : '🎵'}
                        </div>
                    )}

                    {/* Duration badge */}
                    <div className="media-card__duration">
                        {formatDuration(media.duration)}
                    </div>

                    {/* Type badge */}
                    <div className="media-card__type">
                        {media.type === 'video' && '📹'}
                        {media.type === 'audio' && '🎧'}
                        {media.type === 'song' && '🎵'}
                        {media.type === 'cartoon' && '🦄'}
                        {media.type === 'story' && '📚'}
                        {media.type === 'article' && '📄'}
                    </div>
                </div>

                {/* Content */}
                <div className="media-card__content">
                    <h3 className="media-card__title">{media.title}</h3>

                    {media.description && (
                        <p className="media-card__description">
                            {media.description.substring(0, 80)}
                            {media.description.length > 80 ? '...' : ''}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="media-card__metadata">
                        {media.difficulty && (
                            <span className={`media-card__badge ${getDifficultyColor(media.difficulty)}`}>
                                {media.difficulty}
                            </span>
                        )}
                        {media.category && (
                            <span className="media-card__badge bg-purple-500">
                                {media.category}
                            </span>
                        )}
                    </div>

                    {/* View count */}
                    {media.view_count !== undefined && media.view_count > 0 && (
                        <div className="media-card__views">
                            👁️ {media.view_count.toLocaleString()} views
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}
