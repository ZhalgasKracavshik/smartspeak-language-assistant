'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Quest } from '@/services/contentService';
import { Loader2 } from 'lucide-react';

interface QuestFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Quest | null;
    onSave: (data: any) => Promise<void>;
}

export function QuestForm({ open, onOpenChange, initialData, onSave }: QuestFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Quest>>({
        title: '',
        description: '',
        xp_reward: 10,
        target_count: 1,
        type: 'mixed'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                description: '',
                xp_reward: 10,
                target_count: 1,
                type: 'mixed'
            });
        }
    }, [initialData, open]);

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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Quest' : 'Create New Quest'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Quest Title</Label>
                        <Input
                            required
                            value={formData.title || ''}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Daily Vocabulary Master"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description || ''}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="e.g. Learn 5 new words today"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type || 'mixed'}
                                onValueChange={v => setFormData(prev => ({ ...prev, type: v as any }))}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                                    <SelectItem value="grammar">Grammar</SelectItem>
                                    <SelectItem value="speech">Speech</SelectItem>
                                    <SelectItem value="dialogue">Dialogue</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>XP Reward</Label>
                            <Input
                                type="number"
                                required
                                value={formData.xp_reward || 10}
                                onChange={e => setFormData(prev => ({ ...prev, xp_reward: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Target Count (e.g. number of words)</Label>
                        <Input
                            type="number"
                            required
                            value={formData.target_count || 1}
                            onChange={e => setFormData(prev => ({ ...prev, target_count: parseInt(e.target.value) || 1 }))}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Quest
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
