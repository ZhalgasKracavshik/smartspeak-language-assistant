'use client';

import { useState, useEffect } from 'react';
import { Check, Volume2 } from 'lucide-react';
import { VocabularyWord } from '@/services/contentService';

interface VocabularyListProps {
    words: VocabularyWord[];
    moduleNumber: number;
    onProgressUpdate: (progress: number) => void;
}

export default function VocabularyList({ words, moduleNumber, onProgressUpdate }: VocabularyListProps) {
    const [learnedWords, setLearnedWords] = useState<string[]>([]);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    // Load learned words from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem(`grade9_module_${moduleNumber}_progress`);
        if (savedProgress) {
            const { learnedWords } = JSON.parse(savedProgress);
            if (learnedWords) {
                setLearnedWords(learnedWords);
            }
        }
    }, [moduleNumber]);

    const toggleWord = (wordId: string) => {
        const newLearnedWords = learnedWords.includes(wordId)
            ? learnedWords.filter(id => id !== wordId)
            : [...learnedWords, wordId];

        setLearnedWords(newLearnedWords);

        // Save to localStorage
        localStorage.setItem(`grade9_module_${moduleNumber}_progress`, JSON.stringify({
            learnedWords: newLearnedWords,
            lastUpdated: new Date().toISOString()
        }));

        // Update parent progress
        const progress = Math.round((newLearnedWords.length / words.length) * 100);
        onProgressUpdate(progress);
    };

    const playAudio = (word: VocabularyWord) => {
        if (word.audio_url) {
            const audio = new Audio(word.audio_url);
            setPlayingAudio(word.id);
            audio.onended = () => setPlayingAudio(null);
            audio.play().catch(e => console.error("Audio play failed", e));
        } else {
            // Fallback to TTS
            const utterance = new SpeechSynthesisUtterance(word.word);
            utterance.lang = 'en-GB';
            window.speechSynthesis.speak(utterance);
        }
    };

    // Group words by section
    const groupedWords = words.reduce((acc, word) => {
        const key = word.section || 'General';
        if (!acc[key]) acc[key] = [];
        acc[key].push(word);
        return acc;
    }, {} as Record<string, VocabularyWord[]>);

    const sortedSections = Object.keys(groupedWords).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return (
        <div className="space-y-8">
            {sortedSections.map(section => (
                <div key={section}>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 px-2 border-l-4 border-blue-500">
                        {section === 'General' ? 'Vocabulary' : `Section ${section}`}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedWords[section].map((word) => {
                            const isLearned = learnedWords.includes(word.id);

                            return (
                                <div
                                    key={word.id}
                                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all duration-200 ${isLearned
                                        ? 'border-green-500 dark:border-green-600 shadow-sm'
                                        : 'border-transparent shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {word.word}
                                                </h3>
                                                <button
                                                    onClick={() => playAudio(word)}
                                                    className={`p-1 transition-colors ${playingAudio === word.id ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}`}
                                                >
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 space-y-0.5">
                                                <p><span className="text-gray-400 text-xs uppercase mr-1">RU</span> {word.translation_ru}</p>
                                                <p><span className="text-gray-400 text-xs uppercase mr-1">KZ</span> {word.translation_kz}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleWord(word.id)}
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLearned
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
