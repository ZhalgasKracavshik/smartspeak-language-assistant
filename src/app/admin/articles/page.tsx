'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit2, Trash2, Loader2, FileText, BookOpen } from 'lucide-react';
import { contentService, MediaItem } from '@/services/contentService';
import { VideoForm } from '@/components/admin/VideoForm';

export default function ArticleManager() {
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
            // Filter strictly for stories/articles if we want separate views
            const stories = data.filter(item => item.type === 'story');
            setItems(stories);
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem({ title: '', type: 'story' } as any);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: MediaItem) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            const success = await contentService.deleteMediaContent(id);
            if (success) {
                setItems(prev => prev.filter(i => i.id !== id));
            }
        }
    };

    const handleSave = async (data: any) => {
        // Ensure type is story for this view
        const finalData = { ...data, type: 'story' };

        if (editingItem && editingItem.id) {
            const updated = await contentService.updateMediaContent(editingItem.id, finalData);
            if (updated) {
                setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
            }
        } else {
            const created = await contentService.addMediaContent(finalData);
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
                    <h1 className="text-3xl font-bold text-gray-900">Article Manager</h1>
                    <p className="text-gray-500">Manage reading materials and stories</p>
                </div>
                <Button onClick={handleAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4" /> Add Article
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <Input
                            placeholder="Search articles..."
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                            <BookOpen className="size-6" />
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.difficulty === 'A1' ? 'bg-green-100 text-green-700' :
                                                item.difficulty === 'B1' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {item.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{item.description || 'No description'}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">{item.category}</span>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(item)}>
                                                <Edit2 className="size-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-10 text-center text-gray-500">
                                    No articles found.
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
