'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Trophy, Star, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { contentService, Module } from '@/services/contentService';
// Removed static import

interface ModuleProgress {
    moduleId: number;
    wordsLearned: string[];
    grammarCompleted: string[];
    testScore?: number;
    markedComplete: boolean;
}

export function Grade9Dashboard() {
    const [progress, setProgress] = useState<Record<number, ModuleProgress>>({});
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load progress from localStorage
        const saved = localStorage.getItem('grade9-progress');
        if (saved) {
            setProgress(JSON.parse(saved));
        }

        // Fetch modules from DB
        const fetchModules = async () => {
            const data = await contentService.getModules();
            setModules(data);
            setLoading(false);
        };
        fetchModules();
    }, []);

    const getModuleProgress = (moduleId: number) => {
        const moduleProgress = progress[moduleId];
        if (!moduleProgress) return 0;

        // Approx logic since we don't have word count easily here yet, checking length of learned arrays? 
        // Or assume ~20 words per module for progress bar visualization
        // Better: just calc relative to "markedComplete" or just learned count.
        // For migration safety, if wordsLearned exists:
        const learned = moduleProgress.wordsLearned?.length || 0;
        if (moduleProgress.markedComplete) return 100;
        return Math.min(Math.round((learned / 20) * 100), 99); // Arbitrary 20 words cap if not complete
    };

    if (loading) {
        return <div className="p-8 text-center">Loading modules...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/learning">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Learning Hub
                        </Button>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Grade 9 English</h1>
                            <p className="text-gray-600">Excel for Kazakhstan - Complete Course</p>
                        </div>
                    </motion.div>
                </div>

                {/* Overall Progress */}
                <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Your Progress</h3>
                                <p className="text-blue-100">
                                    {Object.values(progress).filter(p => p.markedComplete).length} / {modules.length} modules completed
                                </p>
                            </div>
                            <Trophy className="w-16 h-16 text-yellow-300" />
                        </div>
                        <Progress
                            value={(Object.values(progress).filter(p => p.markedComplete).length / Math.max(modules.length, 1)) * 100}
                            className="mt-4 h-3 bg-white/20"
                        />
                    </CardContent>
                </Card>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, index) => {
                        const progressPercent = getModuleProgress(module.id);
                        const isCompleted = progress[module.id]?.markedComplete;
                        const testScore = progress[module.id]?.testScore;

                        return (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/classes/grade-9/${module.id}`}>
                                    <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-300 relative overflow-hidden h-full">
                                        {/* Background gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${module.color_theme} opacity-5 group-hover:opacity-10 transition-opacity`} />

                                        <CardContent className="p-6 relative flex flex-col h-full">
                                            {/* Module number badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`bg-gradient-to-br ${module.color_theme} px-3 py-1 rounded-full`}>
                                                    <span className="text-white font-bold text-sm">Module {module.id}</span>
                                                </div>
                                                {isCompleted && (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500" />
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {module.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                                                {module.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="space-y-2 mb-4">
                                                {testScore !== undefined && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Test Score</span>
                                                        <span className={`font-semibold ${testScore >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                                                            {testScore}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Progress bar */}
                                            <div className="space-y-2 mt-auto">
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>Progress</span>
                                                    <span className="font-semibold">{progressPercent}%</span>
                                                </div>
                                                <Progress value={progressPercent} className="h-2" />
                                            </div>

                                            {/* Status badge */}
                                            {progressPercent === 0 && (
                                                <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                                                    <Circle className="w-3 h-3" />
                                                    Not started
                                                </div>
                                            )}
                                            {progressPercent > 0 && progressPercent < 100 && (
                                                <div className="mt-3 text-xs text-blue-600 flex items-center gap-1 font-medium">
                                                    <Circle className="w-3 h-3 fill-blue-600" />
                                                    In progress
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Help text */}
                <div className="mt-8 text-center text-gray-600">
                    <p className="text-sm">
                        Click on any module to start learning vocabulary, grammar, and take tests! 🚀
                    </p>
                </div>
            </div>
        </div>
    );
}
