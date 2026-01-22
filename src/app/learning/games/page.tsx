'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, ArrowRight, Gamepad2 } from 'lucide-react';
import '@/styles/games.css';

const GAMES = [
    {
        id: 'negotiator',
        title: 'The Negotiator',
        description: 'Step into the Grand Bazaar and test your bargaining skills against Ahmed, the toughest carpet seller in Istanbul.',
        link: '/negotiator',
        badge: 'Roleplay',
        badgeColor: 'bg-amber-500',
        icon: MessageSquare,
        gradient: 'from-amber-500/10 to-orange-500/10',
        borderColor: 'border-amber-200 dark:border-amber-800'
    },
    {
        id: 'debater',
        title: 'The Debater',
        description: 'Challenge the AI in a fierce debate on random controversial topics. Sharpen your argumentation and logic.',
        link: '/games/debater',
        badge: 'Logic',
        badgeColor: 'bg-blue-500',
        icon: Brain,
        gradient: 'from-blue-500/10 to-indigo-500/10',
        borderColor: 'border-blue-200 dark:border-blue-800'
    }
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
                        <Gamepad2 className="size-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                        Mini-Games Arena
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Gamify your learning experience with immersive AI challenges.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {GAMES.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={game.link} className="group block h-full">
                                <div className={`relative h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${game.borderColor} hover:-translate-y-1`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${game.badgeColor} bg-opacity-10 dark:bg-opacity-20`}>
                                            <game.icon className={`size-6 ${game.badgeColor.replace('bg-', 'text-')}`} />
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${game.badgeColor} bg-opacity-10 text-opacity-80 dark:bg-opacity-20 ${game.badgeColor.replace('bg-', 'text-')}`}>
                                            {game.badge}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {game.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {game.description}
                                    </p>

                                    <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        Play Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
