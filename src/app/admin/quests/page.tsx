'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Loader2, Sword, Star } from 'lucide-react';
import { contentService, Quest } from '@/services/contentService';
import { QuestForm } from '@/components/admin/QuestForm';

export default function QuestsManager() {
    const [items, setItems] = useState<Quest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Quest | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const data = await contentService.getQuests();
            setItems(data);
        } catch (error) {
            console.error('Failed to load quests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Quest) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this quest?')) {
            const success = await contentService.deleteQuest(id);
            if (success) {
                setItems(prev => prev.filter(i => i.id !== id));
            }
        }
    };

    const handleSave = async (data: any) => {
        if (editingItem && editingItem.id) {
            const updated = await contentService.updateQuest(editingItem.id, data);
            if (updated) {
                setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
            }
        } else {
            const created = await contentService.addQuest(data);
            if (created) {
                setItems(prev => [created, ...prev]);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quests Manager</h1>
                    <p className="text-gray-500">Manage daily challenges and rewards</p>
                </div>
                <Button onClick={handleAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4" /> Create Quest
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {items.map((quest) => (
                                <div key={quest.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${quest.type === 'vocabulary' ? 'bg-blue-100 text-blue-600' :
                                                quest.type === 'grammar' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-orange-100 text-orange-600'
                                            }`}>
                                            <Sword className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{quest.title}</h3>
                                            <p className="text-sm text-gray-500">{quest.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full font-medium capitalize">
                                                    {quest.type}
                                                </span>
                                                <span className="text-xs text-yellow-600 flex items-center font-bold">
                                                    <Star className="size-3 mr-1 fill-yellow-500" />
                                                    {quest.xp_reward} XP
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(quest)}>
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(quest.id)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    <Sword className="size-12 mx-auto text-gray-300 mb-3" />
                                    <p>No quests defined yet.</p>
                                    <Button variant="link" onClick={handleAdd}>Create your first quest</Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <QuestForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={editingItem}
                onSave={handleSave}
            />
        </div>
    );
}
