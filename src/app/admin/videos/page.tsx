'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit2, Trash2, Loader2, Video, Clock } from 'lucide-react';
import { contentService, MediaItem } from '@/services/contentService';
import { VideoForm } from '@/components/admin/VideoForm';

export default function VideoManager() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const data = await contentService.getMediaContent();
            setItems(data);
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: MediaItem) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            const success = await contentService.deleteMediaContent(id);
            if (success) {
                setItems(prev => prev.filter(i => i.id !== id));
            }
        }
    };

    const handleSave = async (data: any) => {
        if (editingItem) {
            const updated = await contentService.updateMediaContent(editingItem.id, data);
            if (updated) {
                setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
            }
        } else {
            const created = await contentService.addMediaContent(data);
            if (created) {
                setItems(prev => [created, ...prev]);
            }
        }
    };

    const filteredItems = items.filter(i =>
        i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Video & Content Manager</h1>
                    <p className="text-gray-500">Manage videos, cartoons, and listening materials</p>
                </div>
                <Button onClick={handleAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4" /> Add Content
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <Input
                            placeholder="Search content..."
                            className="pl-10 max-w-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                                    <div className="aspect-video bg-gray-100 relative">
                                        {item.thumbnail_url ? (
                                            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                <Video className="size-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
                                                {item.type}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${item.difficulty === 'A1' ? 'bg-green-500/80 text-white' :
                                                    item.difficulty === 'B1' ? 'bg-yellow-500/80 text-white' :
                                                        'bg-red-500/80 text-white'
                                                }`}>
                                                {item.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description || 'No description'}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Clock className="size-3 mr-1" />
                                                {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                                    <Edit2 className="size-3" />
                                                </Button>
                                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-10 text-center text-gray-500">
                                    No content found.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <VideoForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={editingItem}
                onSave={handleSave}
            />
        </div>
    );
}
