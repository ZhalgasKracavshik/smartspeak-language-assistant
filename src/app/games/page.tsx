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
        image: 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        link: '/negotiator',
        badge: 'Roleplay',
        badgeColor: 'bg-amber-500',
        icon: MessageSquare,
        gradient: 'from-amber-500/20 to-orange-500/20'
    },
    {
        id: 'debater',
        title: 'The Debater',
        description: 'Challenge the AI in a fierce debate on random controversial topics. Sharpen your argumentation and logic.',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        link: '/games/debater',
        badge: 'Logic',
        badgeColor: 'bg-blue-500',
        icon: Brain,
        gradient: 'from-blue-500/20 to-indigo-500/20'
    }
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
                        <Gamepad2 className="size-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                        Mini-Games Arena
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Gamify your learning experience with immersive AI challenges designed to boost your confidence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {GAMES.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={game.link} className="group block h-full">
                                <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
                                    {/* Image Section */}
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img
                                            src={game.image}
                                            alt={game.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className={`absolute top-4 right-4 z-20 ${game.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                                            {game.badge}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className={`p-8 bg-gradient-to-br ${game.gradient} dark:from-gray-800 dark:to-gray-800`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${game.badgeColor} bg-opacity-10 dark:bg-opacity-20`}>
                                                <game.icon className={`size-6 ${game.badgeColor.replace('bg-', 'text-')}`} />
                                            </div>
                                            <ArrowRight className="size-6 text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {game.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {game.description}
                                        </p>
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
