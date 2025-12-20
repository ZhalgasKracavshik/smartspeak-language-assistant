'use client';

import { useState, useEffect } from 'react';
import { Check, Volume2 } from 'lucide-react';

interface VocabularyWord {
    id: string;
    word: string;
    translation_ru: string;
    translation_kz: string;
    partOfSpeech: string;
    example: string;
    module: number;
}

interface VocabularyListProps {
    words: VocabularyWord[];
    moduleNumber: number;
    onProgressUpdate: (progress: number) => void;
}

export default function VocabularyList({ words, moduleNumber, onProgressUpdate }: VocabularyListProps) {
    const [learnedWords, setLearnedWords] = useState<string[]>([]);

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

    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {words.map((word) => {
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
                                        onClick={() => playAudio(word.word)}
                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                                        {word.partOfSpeech}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 space-y-0.5">
                                    <p><span className="text-gray-400 text-xs uppercase mr-1">RU</span> {word.translation_ru}</p>
                                    <p><span className="text-gray-400 text-xs uppercase mr-1">KZ</span> {word.translation_kz}</p>
                                </div>

                                <p className="text-sm italic text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                    "{word.example}"
                                </p>
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
    );
}
