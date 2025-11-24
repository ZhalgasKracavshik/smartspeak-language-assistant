import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Music, BookOpen, Video, Film, Clock, Tag, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { contentDatabase } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { VideoModal } from './VideoModal';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    title: string;
}

export function ContentHub() {
    const { language } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: language === 'kz' ? 'Барлығы' : 'Все', icon: Play },
        { id: 'video', label: language === 'kz' ? 'Бейнелер' : 'Видео', icon: Video },
        { id: 'cartoon', label: language === 'kz' ? 'Мультфильмдер' : 'Мультфильмы', icon: Film },
        { id: 'song', label: language === 'kz' ? 'Әндер' : 'Песни', icon: Music },
        { id: 'story', label: language === 'kz' ? 'Оқығандар' : 'Рассказы', icon: BookOpen },
    ];

    const filteredContent = contentDatabase.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            item.title[language].toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleOpenContent = (url: string) => {
        setSelectedVideo(url);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="mb-2 text-gray-900">{language === 'kz' ? 'Контент-хаб' : 'Контент-хаб'}</h1>
                <p className="text-gray-600">
                    {language === 'kz'
                        ? 'Қызықты видеолар, әндер мен оқығандар арқылы тілді үйреніңіз'
                        : 'Изучайте язык через интересные видео, песни и рассказы'}
                </p>
            </motion.div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 size-5 text-gray-400" />
                    <Input
                        placeholder={language === 'kz' ? 'Іздеу...' : 'Поиск...'}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="whitespace-nowrap"
                        >
                            <Icon className="size-4 mr-2" />
                            {cat.label}
                        </Button>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item, index) => {
                    const Icon = item.type === 'video' ? Video :
                        item.type === 'cartoon' ? Film :
                            item.type === 'song' ? Music : BookOpen;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-all h-full overflow-hidden group cursor-pointer"
                                onClick={() => handleOpenContent(item.url)}>
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title[language]}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-image.jpg'; // Fallback image
                                            target.onerror = null; // Prevent infinite loop
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <Clock className="size-4" />
                                            <span className="text-sm">{item.duration}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-blue-600 text-white">
                                            <Icon className="size-3 mr-1" />
                                            {item.level}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                        {item.title[language]}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {item.description[language]}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.slice(0, 3).map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                <Tag className="size-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {filteredContent.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {language === 'kz' ? 'Контент табылмады' : 'Контент не найден'}
                    </p>
                </div>
            )}

            <VideoModal
                isOpen={selectedVideo !== null}
                onClose={() => setSelectedVideo(null)}
                videoId={selectedVideo || ''}
                title={''} // Added a placeholder title as per the new interface
            />
        </div>
    );
}
