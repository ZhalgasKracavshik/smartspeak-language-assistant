'use client';

import React, { useState, useEffect } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { MediaLoadingSkeleton } from '@/components/MediaLoadingSkeleton';
import { MediaContent, MediaFilters } from '@/types/media';
import { Search, Filter, Film, Music, BookOpen, Sparkles } from 'lucide-react';

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

    const typeButtons = [
        { value: '', label: 'All', icon: Sparkles },
        { value: 'video', label: 'Videos', icon: Film },
        { value: 'song', label: 'Songs', icon: Music },
        { value: 'story', label: 'Stories', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                            <Film className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Content Hub</h1>
                            <p className="text-blue-100 mt-1">Learn English with videos, podcasts & stories</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for content..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 shadow-xl border-0 focus:ring-4 focus:ring-white/30 transition-all"
                        />
                    </div>

                    {/* Type Filter Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {typeButtons.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => handleFilterChange('type', value)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${filters.type === value || (!filters.type && value === '')
                                    ? 'bg-white text-purple-700 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters & Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Advanced Filters */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Filters</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select
                                value={filters.difficulty || ''}
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Levels</option>
                                <option value="beginner">🟢 Beginner</option>
                                <option value="intermediate">🟡 Intermediate</option>
                                <option value="advanced">🔴 Advanced</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({})}
                            className="px-6 py-3 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 font-medium transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white/60 rounded-2xl h-80 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="text-4xl mb-4">😕</div>
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={fetchMedia}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : media.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/50">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No content found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                <span className="font-semibold text-gray-900">{media.length}</span> results found
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {media.map((item) => (
                                <MediaCard key={item.id} media={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
