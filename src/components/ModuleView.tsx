'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Book, CheckCircle, GraduationCap, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import VocabularyList from './VocabularyList';
import GrammarSection from './GrammarSection';
import ModuleTest from './ModuleTest';
import ModulePractice from './ModulePractice';

import PhrasalVerbsList from './PhrasalVerbsList';

interface ModuleViewProps {
    data: any; // Type should be imported from page ideally, but any is acceptable here for now given existing code
}

export default function ModuleView({ data }: ModuleViewProps) {
    const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar' | 'practice' | 'test' | 'materials'>('vocabulary');
    const [progress, setProgress] = useState(0);

    // Load progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem(`grade9_module_${data.moduleNumber}_progress`);
        if (savedProgress) {
            const { learnedWords } = JSON.parse(savedProgress);
            if (learnedWords && data.vocabulary.length > 0) {
                setProgress(Math.round((learnedWords.length / data.vocabulary.length) * 100));
            }
        }
    }, [data.moduleNumber, data.vocabulary.length]);

    const handleProgressUpdate = (newProgress: number) => {
        setProgress(newProgress);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center mb-4">
                        <Link
                            href="/classes"
                            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Module {data.moduleNumber}: {data.title}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {data.description}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-md">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="flex space-x-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('vocabulary')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === 'vocabulary'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <Book className="w-4 h-4 mr-2" />
                            Vocabulary
                        </button>
                        <button
                            onClick={() => setActiveTab('grammar')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === 'grammar'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Grammar
                        </button>
                        <button
                            onClick={() => setActiveTab('practice')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === 'practice'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Practice
                        </button>
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === 'test'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'vocabulary' && (
                        <motion.div
                            key="vocabulary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <VocabularyList
                                words={data.vocabulary}
                                moduleNumber={data.moduleNumber}
                                onProgressUpdate={handleProgressUpdate}
                            />

                            {data.phrasalVerbs && data.phrasalVerbs.length > 0 && (
                                <>
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>
                                    <PhrasalVerbsList verbs={data.phrasalVerbs} />
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'grammar' && (
                        <motion.div
                            key="grammar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GrammarSection rules={data.grammar} />
                        </motion.div>
                    )}

                    {activeTab === 'practice' && (
                        <motion.div
                            key="practice"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ModulePractice vocabulary={data.vocabulary} />
                        </motion.div>
                    )}

                    {activeTab === 'test' && (
                        <motion.div
                            key="test"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ModuleTest
                                vocabulary={data.vocabulary}
                                moduleNumber={data.moduleNumber}
                                practiceQuestions={data.practiceQuestions}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'materials' && (
                        <motion.div
                            key="materials"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[
                                { title: 'Wordlist PDF', type: 'PDF', size: '150KB', color: 'bg-red-100 text-red-600' },
                                { title: 'Grammar Guide', type: 'DOCX', size: '45KB', color: 'bg-blue-100 text-blue-600' },
                                { title: 'Video Lesson', type: 'MP4', size: '12MB', color: 'bg-purple-100 text-purple-600' },
                                { title: 'Listening Task', type: 'MP3', size: '4MB', color: 'bg-green-100 text-green-600' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group cursor-pointer">
                                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Book className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{item.type}</span>
                                        <span>{item.size}</span>
                                    </div>
                                    <button className="w-full mt-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
                                        Download
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
