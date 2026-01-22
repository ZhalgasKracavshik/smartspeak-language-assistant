'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { PhrasalVerb } from '@/services/contentService';

interface PhrasalVerbsListProps {
    verbs: PhrasalVerb[];
}

export default function PhrasalVerbsList({ verbs }: PhrasalVerbsListProps) {
    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Phrasal Verbs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verbs.map((verb) => (
                    <div
                        key={verb.id}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        <span className="text-blue-600 dark:text-blue-400">{verb.base_verb}</span> {verb.particle}
                                    </h3>
                                    <button
                                        onClick={() => playAudio(`${verb.base_verb} ${verb.particle}`)}
                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 space-y-0.5">
                                    <p className="font-medium">{verb.meaning_en}</p>
                                    {verb.meaning_ru && (
                                        <p className="text-gray-500"><span className="text-gray-400 text-xs uppercase mr-1">RU</span> {verb.meaning_ru}</p>
                                    )}
                                    {verb.meaning_kz && (
                                        <p className="text-gray-500"><span className="text-gray-400 text-xs uppercase mr-1">KZ</span> {verb.meaning_kz}</p>
                                    )}
                                </div>

                                {verb.example_en && (
                                    <p className="text-sm italic text-gray-500 dark:text-gray-400 border-l-2 border-orange-200 dark:border-orange-800 pl-2">
                                        "{verb.example_en}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
