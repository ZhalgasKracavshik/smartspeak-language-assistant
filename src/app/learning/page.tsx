'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, MessageSquare, Gamepad, BookOpen, Stethoscope, Volume2, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

export default function LearningPage() {
    const { language } = useLanguage();
    const router = useRouter();

    const translations = {
        title: { ru: 'Изучение', kz: 'Оқу' },
        subtitle: { ru: 'Выберите способ изучения английского', kz: 'Ағылшын тілін үйрену әдісін таңдаңыз' },
        grammar: { ru: 'Грамматика', kz: 'Грамматика' },
        dialogues: { ru: 'Диалоги', kz: 'Диалогтар' },
        games: { ru: 'Мини-игры', kz: 'Мини-ойындар' },
        vocabulary: { ru: 'Словарь', kz: 'Сөздік' },
        medical: { ru: 'Медтермины', kz: 'Медтерминдер' },
        voice: { ru: 'Голос', kz: 'Дауыс' },
        content: { ru: 'Контент', kz: 'Контент' },
    };

    const learningOptions = [
        {
            id: 'grammar',
            title: translations.grammar[language],
            description: language === 'ru' ? 'Времена, условия, грамматические правила' : 'Шақтар, шарттар, грамматикалық ережелер',
            icon: BookMarked,
            gradient: 'from-blue-500 to-cyan-500',
            path: '/learning/grammar'
        },
        {
            id: 'dialogues',
            title: translations.dialogues[language],
            description: language === 'ru' ? 'Практика реальных разговоров' : 'Нағыз әңгімелерді жаттықтыру',
            icon: MessageSquare,
            gradient: 'from-purple-500 to-pink-500',
            path: '/learning/dialogues'
        },
        {
            id: 'games',
            title: translations.games[language],
            description: language === 'ru' ? 'Обучение через игры' : 'Ойындар арқылы оқыту',
            icon: Gamepad,
            gradient: 'from-green-500 to-emerald-500',
            path: '/learning/games'
        },
        {
            id: 'vocabulary',
            title: translations.vocabulary[language],
            description: language === 'ru' ? 'Умный словарь с запоминанием' : 'Есте сақтайтын акылды сөздік',
            icon: BookOpen,
            gradient: 'from-orange-500 to-red-500',
            path: '/learning/vocabulary'
        },
        {
            id: 'medical',
            title: translations.medical[language],
            description: language === 'ru' ? 'Медицинская терминология' : 'Медициналық терминология',
            icon: Stethoscope,
            gradient: 'from-rose-500 to-pink-600',
            path: '/learning/medical'
        },
        {
            id: 'voice',
            title: translations.voice[language],
            description: language === 'ru' ? 'Практика произношения' : 'Айтылымды жаттықтыру',
            icon: Volume2,
            gradient: 'from-indigo-500 to-purple-500',
            path: '/learning/voice'
        },
        {
            id: 'content',
            title: translations.content[language],
            description: language === 'ru' ? 'Видео, подкасты, статьи' : 'Бейне, подкасттар, мақалалар',
            icon: Globe,
            gradient: 'from-teal-500 to-cyan-500',
            path: '/learning/content'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 md:p-8 pb-20 md:pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        {translations.title[language]}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {translations.subtitle[language]}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {learningOptions.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden h-full group bg-white"
                                    onClick={() => router.push(option.path)}
                                >
                                    <CardContent className="p-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="size-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                                            {option.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {option.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
