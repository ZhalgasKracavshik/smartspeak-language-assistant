import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { VocabularyWord } from '../../services/contentService';
import { Loader2 } from 'lucide-react';

interface VocabularyFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: VocabularyWord | null;
    onSave: (word: Omit<VocabularyWord, 'id'> | Partial<VocabularyWord>) => Promise<void>;
}

export function VocabularyForm({ open, onOpenChange, initialData, onSave }: VocabularyFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<VocabularyWord>>({
        word: '',
        translation_ru: '',
        translation_kz: '',
        section: '',
        audio_url: '',
        image_url: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                word: '',
                translation_ru: '',
                translation_kz: '',
                section: '',
                audio_url: '',
                image_url: ''
            });
        }
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData as any);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Word' : 'Add New Word'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Word (English)</Label>
                            <Input
                                required
                                value={formData.word || ''}
                                onChange={e => setFormData(prev => ({ ...prev, word: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Section</Label>
                            <Input
                                value={formData.section || ''}
                                onChange={e => setFormData(prev => ({ ...prev, section: e.target.value }))}
                                placeholder="e.g. 1a"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Translation (RU)</Label>
                            <Input
                                required
                                value={formData.translation_ru || ''}
                                onChange={e => setFormData(prev => ({ ...prev, translation_ru: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Translation (KZ)</Label>
                            <Input
                                required
                                value={formData.translation_kz || ''}
                                onChange={e => setFormData(prev => ({ ...prev, translation_kz: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Audio URL</Label>
                        <Input
                            value={formData.audio_url || ''}
                            onChange={e => setFormData(prev => ({ ...prev, audio_url: e.target.value }))}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                            value={formData.image_url || ''}
                            onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                            placeholder="https://..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Word
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
