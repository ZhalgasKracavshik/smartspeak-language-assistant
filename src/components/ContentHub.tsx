'use client';

import React, { useState, useEffect } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { MediaLoadingSkeleton } from '@/components/MediaLoadingSkeleton';
import { MediaContent, MediaFilters } from '@/types/media';
import './MediaCard.css';

export function ContentHub() {
    const [media, setMedia] = useState<MediaContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<MediaFilters>({});

    useEffect(() => {
        fetchMedia();
    }, [filters]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filters.type) params.append('type', filters.type);
            if (filters.difficulty) params.append('difficulty', filters.difficulty);
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`/api/media?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch media');
            }

            const data = await response.json();
            setMedia(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching media:', err);
            setError('Failed to load content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof MediaFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === '' ? undefined : value,
        }));
    };

    return (
        <div className="content-hub">
            <div className="content-hub__header">
                <h1 className="content-hub__title">🎬 Learn English with Content</h1>

                {/* Filters */}
                <div className="content-hub__filters">
                    <div className="content-hub__filter-group">
                        <label className="content-hub__filter-label">Type</label>
                        <select
                            className="content-hub__select"
                            value={filters.type || ''}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="video">Videos</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>

                    <div className="content-hub__filter-group">
                        <label className="content-hub__filter-label">Difficulty</label>
                        <select
                            className="content-hub__select"
                            value={filters.difficulty || ''}
                            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="content-hub__filter-group">
                        <label className="content-hub__filter-label">Category</label>
                        <select
                            className="content-hub__select"
                            value={filters.category || ''}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="music">Music</option>
                            <option value="movies">Movies</option>
                            <option value="podcasts">Podcasts</option>
                            <option value="interviews">Interviews</option>
                            <option value="tv-shows">TV Shows</option>
                            <option value="documentaries">Documentaries</option>
                        </select>
                    </div>

                    <div className="content-hub__filter-group" style={{ flex: 1 }}>
                        <label className="content-hub__filter-label">Search</label>
                        <input
                            type="text"
                            className="content-hub__search"
                            placeholder="Search by title or description..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <MediaLoadingSkeleton />
            ) : error ? (
                <div className="content-hub__error">{error}</div>
            ) : media.length === 0 ? (
                <div className="content-hub__empty">
                    <p>No content found. Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="content-hub__grid">
                    {media.map((item) => (
                        <MediaCard key={item.id} media={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
