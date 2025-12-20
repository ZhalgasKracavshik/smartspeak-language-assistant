import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Play } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { InterestService } from '../services/InterestService';
import { contentService } from '../services/contentService';

// Local interface compatible with DB and Component needs
interface ContentItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    tags: string[];
    level: string;
    duration: string;
    type: 'video' | 'article' | 'song' | 'cartoon' | 'story';
}

export default function DailyRecommendations() {
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
    const [userInterests, setUserInterests] = useState<string[]>([]);

    useEffect(() => {
        loadPersonalizedContent();
    }, []);

    const loadPersonalizedContent = async () => {
        try {
            // 1. Get user's top interests
            const interests = await InterestService.getTopInterests(3);
            setUserInterests(interests);

            // 2. Fetch content from DB based on interests (managed by contentService)
            const dbContent = await contentService.getRecommendedContent(interests);

            // 3. Map DB content to local interface
            const mappedContent: ContentItem[] = dbContent.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description || '',
                type: item.type,
                url: item.cloudinary_url || '',
                thumbnail: item.thumbnail_url || '',
                tags: [item.category || 'general'], // Simplified tags mapping
                level: (item.difficulty as any) || 'intermediate',
                duration: item.duration ? `${Math.floor(item.duration / 60)} min` : '5 min'
            }));

            setRecommendations(mappedContent);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <RefreshCw className="size-6 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-purple-600" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Recommended for You</h3>
                        <p className="text-xs text-gray-500">
                            Based on your interests: {userInterests.join(', ')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={loadPersonalizedContent}
                    className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                >
                    <RefreshCw className="size-3" /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                    <div
                        key={rec.id}
                        className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
                        onClick={() => setSelectedVideo(rec)}
                    >
                        <div className="relative aspect-video bg-gray-100">
                            <img
                                src={rec.thumbnail}
                                alt={rec.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="bg-purple-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                                    <Play className="size-6 text-white fill-white" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                                {rec.duration}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex gap-2 mb-2">
                                {rec.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{rec.title}</h4>
                            <p className="text-xs text-gray-500 capitalize">{rec.level} Level</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <VideoModal
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    videoId={selectedVideo.url} // Note: This expects ID or URL depending on player implementation
                    title={selectedVideo.title}
                />
            )}
        </div>
    );
}
