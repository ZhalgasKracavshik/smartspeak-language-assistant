'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { contentService, VocabularyWord } from '@/services/contentService';
import { useLanguage } from '@/contexts/LanguageContext';
import { VocabularyForm } from '@/components/admin/VocabularyForm';

export default function VocabularyManager() {
    const { language } = useLanguage();
    const [words, setWords] = useState<VocabularyWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);

    useEffect(() => {
        loadWords();
    }, []);

    const loadWords = async () => {
        setIsLoading(true);
        try {
            const data = await contentService.getAllVocabulary();
            setWords(data);
        } catch (error) {
            console.error('Failed to load words:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingWord(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (word: VocabularyWord) => {
        setEditingWord(word);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this word?')) {
            const success = await contentService.deleteVocabularyWord(id);
            if (success) {
                setWords(prev => prev.filter(w => w.id !== id));
            }
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (editingWord) {
                const updated = await contentService.updateVocabularyWord(editingWord.id, data);
                if (updated) {
                    setWords(prev => prev.map(w => w.id === updated.id ? updated : w));
                    setIsDialogOpen(false); // Close dialog on success
                } else {
                    alert('Failed to update word. Please check your permissions or try again.');
                }
            } else {
                const created = await contentService.addVocabularyWord(data);
                if (created) {
                    setWords(prev => [created, ...prev]);
                    setIsDialogOpen(false); // Close dialog on success
                } else {
                    alert('Failed to add word. Please check your permissions or try again.');
                }
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('An unexpected error occurred.');
        }
    };

    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.translation_ru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.translation_kz?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vocabulary Manager</h1>
                    <p className="text-gray-500">Manage dictionary words and translations</p>
                </div>
                <Button onClick={handleAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4" /> Add Word
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <Input
                            placeholder="Search words..."
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="p-3">Word</th>
                                        <th className="p-3">Translation (RU / KZ)</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredWords.map((word) => (
                                        <tr key={word.id} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium">{word.word}</td>
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700">{word.translation_ru}</span>
                                                    <span className="text-gray-400 text-xs">{word.translation_kz}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-right space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(word)} className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(word.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredWords.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">No words found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <VocabularyForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={editingWord}
                onSave={handleSave}
            />
        </div>
    );
}
