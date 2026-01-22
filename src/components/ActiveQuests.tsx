'use client';

import React, { useEffect, useState } from 'react';
import { contentService, Quest } from '../services/contentService';
import { Card, CardContent } from './ui/card';
import { Target, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ActiveQuest extends Quest {
    progress: number;
    is_completed: boolean;
}

export function ActiveQuests() {
    const [quests, setQuests] = useState<ActiveQuest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuests();
    }, []);

    const loadQuests = async () => {
        setLoading(true);
        const data = await contentService.getUserDailyQuests();
        setQuests(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6 flex justify-center">
                    <Loader2 className="animate-spin text-blue-500" />
                </CardContent>
            </Card>
        );
    }

    if (quests.length === 0) {
        return (
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                    <p className="text-gray-500 text-sm">No active quests for today.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="text-blue-600 size-5" />
                    <h2 className="font-bold text-lg text-gray-900">Daily Quests</h2>
                </div>

                <div className="space-y-4">
                    {quests.map((quest, index) => (
                        <motion.div
                            key={quest.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-4 rounded-xl border transition-all ${quest.is_completed
                                    ? 'bg-green-50 border-green-100'
                                    : 'bg-gray-50 border-gray-100 hover:border-blue-100'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className={`font-semibold ${quest.is_completed ? 'text-green-800' : 'text-gray-900'}`}>
                                        {quest.title}
                                    </h3>
                                    {quest.description && (
                                        <p className="text-xs text-gray-500 mt-0.5">{quest.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full shadow-sm">
                                    <Zap className="size-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold text-gray-700">+{quest.xp_reward} XP</span>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                    <span>Progress</span>
                                    <span className={quest.is_completed ? 'text-green-600 font-bold' : ''}>
                                        {quest.progress} / {quest.target_count}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${quest.is_completed ? 'bg-green-500' : 'bg-blue-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (quest.progress / quest.target_count) * 100)}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {quest.is_completed && (
                                <div className="absolute top-2 right-2 -mt-1 -mr-1">
                                    <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
                                        <CheckCircle2 className="size-3" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
