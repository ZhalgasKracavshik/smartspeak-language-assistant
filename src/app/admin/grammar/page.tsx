'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { BookOpen, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { contentService, GrammarTopic, Module } from '../../../services/contentService';

export default function GrammarEditorPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTopic, setEditingTopic] = useState<GrammarTopic | null>(null);
    const [formData, setFormData] = useState({
        title_en: '',
        title_ru: '',
        rule_en: '',
        rule_ru: '',
        examples: ['']
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadModules();
    }, []);

    useEffect(() => {
        if (selectedModule) {
            loadGrammarTopics(selectedModule);
        }
    }, [selectedModule]);

    const loadModules = async () => {
        const data = await contentService.getModules();
        setModules(data);
    };

    const loadGrammarTopics = async (moduleId: number) => {
        setLoading(true);
        const data = await contentService.getModuleGrammar(moduleId);
        setGrammarTopics(data);
        setLoading(false);
    };

    const startEditing = (topic?: GrammarTopic) => {
        if (topic) {
            setEditingTopic(topic);
            setFormData({
                title_en: topic.title_en,
                title_ru: topic.title_ru || '',
                rule_en: topic.rule_en,
                rule_ru: topic.rule_ru || '',
                examples: topic.examples && topic.examples.length > 0 ? topic.examples : ['']
            });
        } else {
            setEditingTopic(null);
            setFormData({
                title_en: '',
                title_ru: '',
                rule_en: '',
                rule_ru: '',
                examples: ['']
            });
        }
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditingTopic(null);
        setFormData({
            title_en: '',
            title_ru: '',
            rule_en: '',
            rule_ru: '',
            examples: ['']
        });
    };

    const handleSave = async () => {
        if (!selectedModule) return;

        setLoading(true);

        // Filter out empty strings
        const cleanedExamples = formData.examples.filter(e => e.trim() !== '');

        if (editingTopic) {
            // Update existing topic
            await contentService.updateGrammarTopic(editingTopic.id, {
                title_en: formData.title_en,
                title_ru: formData.title_ru,
                rule_en: formData.rule_en,
                rule_ru: formData.rule_ru,
                examples: cleanedExamples
            });
        } else {
            // Create new topic
            await contentService.addGrammarTopic({
                module_id: selectedModule,
                title_en: formData.title_en,
                title_ru: formData.title_ru,
                rule_en: formData.rule_en,
                rule_ru: formData.rule_ru,
                examples: cleanedExamples
            });
        }

        await loadGrammarTopics(selectedModule);
        cancelEditing();
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this grammar topic?')) return;

        setLoading(true);
        await contentService.deleteGrammarTopic(id);
        if (selectedModule) {
            await loadGrammarTopics(selectedModule);
        }
        setLoading(false);
    };

    const addArrayField = (field: 'examples') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field: 'examples', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateArrayField = (field: 'examples', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Grammar Editor</h1>
                <p className="text-gray-500">Manage grammar topics for each module</p>
            </div>

            {/* Module Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="size-5" />
                        Select Module
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {modules.map(module => (
                            <Button
                                key={module.id}
                                onClick={() => setSelectedModule(module.id)}
                                variant={selectedModule === module.id ? 'default' : 'outline'}
                                className="h-auto py-3 flex flex-col items-start"
                            >
                                <span className="font-medium">{module.title}</span>
                                <span className="text-xs opacity-70">Grade {module.grade_level}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Grammar Topics List */}
            {selectedModule && !isEditing && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Grammar Topics</CardTitle>
                        <Button onClick={() => startEditing()} className="bg-green-600 hover:bg-green-700">
                            <Plus className="size-4 mr-2" />
                            Add Topic
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : grammarTopics.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No grammar topics yet. Click "Add Topic" to create one.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {grammarTopics.map(topic => (
                                    <Card key={topic.id} className="border border-gray-200">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{topic.title_en}</h3>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => startEditing(topic)}
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(topic.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-3 text-sm">{topic.rule_en.substring(0, 100)}...</p>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Rule (Strict):</h4>
                                                    <p className="text-sm text-gray-600">{topic.rule_en}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Examples:</h4>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {topic.examples?.map((example, idx) => (
                                                            <li key={idx} className="text-sm text-gray-600">{example}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Editor Form */}
            {isEditing && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingTopic ? 'Edit Grammar Topic' : 'Add Grammar Topic'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title EN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
                            <input
                                type="text"
                                value={formData.title_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Present Simple Tense"
                            />
                        </div>

                        {/* Title RU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title (Russian) - Optional</label>
                            <input
                                type="text"
                                value={formData.title_ru}
                                onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Простое настоящее время"
                            />
                        </div>

                        {/* Rule EN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rule (English)</label>
                            <textarea
                                value={formData.rule_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, rule_en: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Explanation of the grammar rule in English..."
                            />
                        </div>

                        {/* Rule RU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rule (Russian) - Optional</label>
                            <textarea
                                value={formData.rule_ru}
                                onChange={(e) => setFormData(prev => ({ ...prev, rule_ru: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Explanation of the grammar rule in Russian..."
                            />
                        </div>

                        {/* Examples */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Examples</label>
                            {formData.examples.map((example, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={example}
                                        onChange={(e) => updateArrayField('examples', index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Example ${index + 1}`}
                                    />
                                    {formData.examples.length > 1 && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeArrayField('examples', index)}
                                            className="text-red-600"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={() => addArrayField('examples')}>
                                <Plus className="size-4 mr-2" />
                                Add Example
                            </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleSave} disabled={loading || !formData.title_en} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="size-4 mr-2" />
                                Save
                            </Button>
                            <Button onClick={cancelEditing} variant="outline">
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
