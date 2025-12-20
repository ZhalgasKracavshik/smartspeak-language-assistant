'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import ModuleView from '@/components/ModuleView';
import { contentService, Module, VocabularyWord, GrammarTopic } from '@/services/contentService';

interface ModuleData {
    moduleNumber: number;
    title: string;
    description: string;
    vocabulary: VocabularyWord[];
    grammar: GrammarTopic[];
}

export default function ModulePage({ params }: { params: { moduleId: string } }) {
    // Extract ID from params. Note: folder is [moduleId], passed as string.
    // If url is /classes/grade-9/1, params.moduleId is '1'.
    // If url is /classes/grade-9/module-1, params.moduleId is 'module-1'.
    // Previous logic handled 'module-' prefix, I will keep it robust.

    const parseId = (rawId: string): number => {
        const cleaned = rawId.replace('module-', '');
        const num = Number(cleaned);
        return isNaN(num) ? -1 : num;
    };

    const id = parseId(params.moduleId);
    const [data, setData] = useState<ModuleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id < 1) {
            setError(true);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [mod, vocab, grammar] = await Promise.all([
                    contentService.getModuleById(id),
                    contentService.getModuleVocabulary(id),
                    contentService.getModuleGrammar(id)
                ]);

                if (!mod) {
                    setError(true);
                } else {
                    setData({
                        moduleNumber: mod.id,
                        title: mod.title,
                        description: mod.description,
                        vocabulary: vocab,
                        grammar: grammar
                    });
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !data) {
        return <div className="p-8 text-center text-red-500">Module not found</div>;
    }

    return <ModuleView data={data} />;
}
