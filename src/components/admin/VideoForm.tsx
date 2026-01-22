'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MediaItem, contentService } from '@/services/contentService';
import { Loader2, Trash2 } from 'lucide-react';

interface VideoFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: MediaItem | null;
    onSave: (data: any) => Promise<void>;
}

export function VideoForm({ open, onOpenChange, initialData, onSave }: VideoFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [subtitles, setSubtitles] = useState<any[]>([]);
    const [isLoadingSubtitles, setIsLoadingSubtitles] = useState(false);
    const [formData, setFormData] = useState<Partial<MediaItem>>({
        title: '',
        description: '',
        type: 'video',
        cloudinary_url: '', // or url
        thumbnail_url: '',
        difficulty: 'B1',
        category: 'General',
        duration: 0
    });

    useEffect(() => {
        if (initialData && open) {
            setFormData(initialData);
            loadSubtitles(initialData.id);
        } else if (open) {
            setFormData({
                title: '',
                description: '',
                type: 'video',
                cloudinary_url: '',
                thumbnail_url: '',
                difficulty: 'B1',
                category: 'General',
                duration: 0
            });
            setSubtitles([]);
        }
    }, [initialData, open]);

    const loadSubtitles = async (mediaId: string) => {
        setIsLoadingSubtitles(true);
        try {
            const subs = await contentService.getSubtitles(mediaId);
            setSubtitles(subs);
        } catch (error) {
            console.error('Failed to load subtitles:', error);
        } finally {
            setIsLoadingSubtitles(false);
        }
    };

    const handleUpdateSubtitle = async (id: string, updates: any) => {
        const updated = await contentService.updateSubtitle(id, updates);
        if (updated) {
            setSubtitles(prev => prev.map(s => s.id === id ? updated : s));
        }
    };

    const handleDeleteSubtitle = async (id: string) => {
        if (window.confirm('Delete this subtitle?')) {
            const success = await contentService.deleteSubtitle(id);
            if (success) {
                setSubtitles(prev => prev.filter(s => s.id !== id));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Video & Subtitles' : 'Add New Video'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-8 py-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                required
                                value={formData.title || ''}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type || 'video'}
                                    onValueChange={v => setFormData(prev => ({ ...prev, type: v as any }))}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="cartoon">Cartoon</SelectItem>
                                        <SelectItem value="song">Song</SelectItem>
                                        <SelectItem value="story">Story</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select
                                    value={formData.difficulty || 'B1'}
                                    onValueChange={v => setFormData(prev => ({ ...prev, difficulty: v }))}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => (
                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Input
                                value={formData.category || ''}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="e.g. Science, Fun, History"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Video URL / Cloudinary ID</Label>
                            <Input
                                required
                                value={formData.cloudinary_url || ''}
                                onChange={e => setFormData(prev => ({ ...prev, cloudinary_url: e.target.value, url: e.target.value }))}
                                placeholder="Public ID or Full URL"
                            />
                            <p className="text-xs text-gray-500">Provide Cloudinary Public ID for best performance, or YouTube URL.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Thumbnail URL (Optional)</Label>
                            <Input
                                value={formData.thumbnail_url || ''}
                                onChange={e => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description || ''}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Duration (seconds)</Label>
                            <Input
                                type="number"
                                value={formData.duration || 0}
                                onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>

                    {initialData && (
                        <div className="space-y-4 pt-6 border-t">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Subtitles Editor</h3>
                                {isLoadingSubtitles && <Loader2 className="size-4 animate-spin text-blue-500" />}
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {subtitles.length === 0 && !isLoadingSubtitles && (
                                    <p className="text-sm text-gray-500 italic">No subtitles found for this video.</p>
                                )}
                                {subtitles.map((sub, idx) => (
                                    <div key={sub.id} className="p-3 bg-gray-50 rounded-lg border space-y-2 group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {sub.start_time}s - {sub.end_time}s
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteSubtitle(sub.id)}
                                            >
                                                <Trash2 className="size-3" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <Input
                                                className="text-sm h-8"
                                                value={sub.text_en}
                                                onChange={e => handleUpdateSubtitle(sub.id, { text_en: e.target.value })}
                                                placeholder="English text"
                                            />
                                            <Input
                                                className="text-sm h-8"
                                                value={sub.text_ru || ''}
                                                onChange={e => handleUpdateSubtitle(sub.id, { text_ru: e.target.value })}
                                                placeholder="Russian translation"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
