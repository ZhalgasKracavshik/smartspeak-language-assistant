'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Library, CheckCircle2, Circle, ChevronDown, ChevronRight, Lock, Play, Star, Trophy, Zap, BookOpen, GraduationCap } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { contentService, Module } from '@/services/contentService';

interface DictionaryItem {
    word: string;
    trans: string;
    context: string;
}

interface Section {
    id: string;
    items: DictionaryItem[];
}

interface GradeContent {
    dictionary: any[]; // Using any/Module derived type if expanded
    rules: any[];
    materials: any[];
}

interface ModuleProgress {
    moduleId: number;
    wordsLearned: string[];
    grammarCompleted: string[];
    testScore?: number;
    markedComplete: boolean;
}

export function Classes() {
    const { language } = useLanguage();
    const [selectedGrade, setSelectedGrade] = useState<string>('9');
    const [activeTab, setActiveTab] = useState('dictionary');
    const [progress, setProgress] = useState<Record<number, ModuleProgress>>({});
    const [grade9Modules, setGrade9Modules] = useState<Module[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const grades = ['5', '6', '7', '8', '9'];

    useEffect(() => {
        // Load progress from localStorage for Grade 9
        const saved = localStorage.getItem('grade9-progress');
        if (saved) {
            setProgress(JSON.parse(saved));
        }

        // Fetch Grade 9 modules
        const fetchModules = async () => {
            try {
                setIsLoading(true);
                const modules = await contentService.getModules();
                if (modules.length === 0) {
                    console.warn('No modules found in DB');
                    // Could set error here if we expect modules to always exist
                }
                setGrade9Modules(modules);
                setFetchError(null);
            } catch (err) {
                console.error('Failed to fetch modules:', err);
                setFetchError('Failed to load modules. Please refresh.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchModules();
    }, []);

    const getModuleProgress = (moduleId: number) => {
        const moduleProgress = progress[moduleId];
        if (!moduleProgress) return 0;

        // Approx logic for progress bar
        if (moduleProgress.markedComplete) return 100;
        const learned = moduleProgress.wordsLearned?.length || 0;
        return Math.min(Math.round((learned / 20) * 100), 99);
    };

    const translations = {
        title: { kz: 'Сыныптар', ru: 'Классы' },
        subtitle: { kz: 'Мектеп бағдарламасы бойынша материалдар', ru: 'Материалы по школьной программе' },
        grade: { kz: 'сынып', ru: 'класс' },
        dictionary: { kz: 'Сөздіктер', ru: 'Словари' },
        rules: { kz: 'Ережелер', ru: 'Правила' },
        materials: { kz: 'Материалдар', ru: 'Материалы' },
        locked: { kz: 'Бұл бөлім әзірленуде', ru: 'Этот раздел в разработке' },
        start: { kz: 'Бастау', ru: 'Начать' },
        yourProgress: { kz: 'Сіздің прогресіңіз', ru: 'Ваш прогресс' },
        modulesCompleted: { kz: 'модуль аяқталды', ru: 'модулей завершено' },
        vocabulary: { kz: 'Сөздік', ru: 'Словарь' },
        words: { kz: 'сөз', ru: 'слов' },
        testScore: { kz: 'Тест нәтижесі', ru: 'Результат теста' },
        progress: { kz: 'Прогресс', ru: 'Прогресс' },
        notStarted: { kz: 'Басталмаған', ru: 'Не начат' },
        inProgress: { kz: 'Орындалуда', ru: 'В процессе' },
        clickToStart: { kz: 'Модульді бастау үшін басыңыз', ru: 'Нажмите на модуль, чтобы начать!' }
    };

    const content: Record<string, GradeContent> = {
        '5': {
            dictionary: [
                {
                    id: 'Module 1',
                    title: 'All about me',
                    sections: [
                        {
                            id: '1a',
                            items: [
                                { word: 'Family', trans: 'Отбасы', context: 'My family is big.' },
                                { word: 'School', trans: 'Мектеп', context: 'I go to school.' },
                                { word: 'Friend', trans: 'Дос', context: 'He is my best friend.' },
                            ]
                        }
                    ]
                }
            ],
            rules: [
                { title: 'Present Simple', desc: 'Basic present tense' },
                { title: 'Plural Nouns', desc: 'Adding -s/-es' },
            ],
            materials: [
                { title: 'Unit 1: All about me', type: 'PDF' },
                { title: 'Unit 2: My home', type: 'Video' },
            ]
        },
        '6': { dictionary: [], rules: [], materials: [] },
        '7': { dictionary: [], rules: [], materials: [] },
        '8': { dictionary: [], rules: [], materials: [] },
        '9': { dictionary: [], rules: [], materials: [] }, // Grade 9 uses gamified view (dynamic)
    };

    const currentContent = content[selectedGrade as keyof typeof content] || content['5'];

    const renderGrade9Content = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center p-12">
                    <LoadingSpinner size="lg" />
                </div>
            );
        }

        if (fetchError) {
            return (
                <div className="text-center p-12 text-red-500 bg-red-50 rounded-xl">
                    <p>{fetchError}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">
                        Try Again
                    </button>
                </div>
            );
        }

        if (grade9Modules.length === 0) {
            return (
                <div className="text-center p-12 text-gray-500 bg-gray-50 rounded-xl">
                    <p>{language === 'kz' ? 'Модульдер табылмады' : 'Модули не найдены'}</p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Overall Progress Card */}
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{translations.yourProgress[language]}</h3>
                                <p className="text-blue-100">
                                    {Object.values(progress).filter(p => p.markedComplete).length} / {grade9Modules.length || 1} {translations.modulesCompleted[language]}
                                </p>
                            </div>
                            <Trophy className="w-16 h-16 text-yellow-300" />
                        </div>
                        <Progress
                            value={(Object.values(progress).filter(p => p.markedComplete).length / (grade9Modules.length || 1)) * 100}
                            className="mt-4 h-3 bg-white/20"
                        />
                    </CardContent>
                </Card>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grade9Modules.map((module, index) => {
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
                                        {/* Background gradient (using color_theme) */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${module.color_theme} opacity-5 group-hover:opacity-10 transition-opacity`} />

                                        <CardContent className="p-6 relative">
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
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {module.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">{translations.vocabulary[language]}</span>
                                                    <span className="font-semibold text-gray-900">
                                                        ... {translations.words[language]}
                                                    </span>
                                                </div>
                                                {testScore !== undefined && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">{translations.testScore[language]}</span>
                                                        <span className={`font-semibold ${testScore >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                                                            {testScore}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Progress bar */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{translations.progress[language]}</span>
                                                    <span className="font-semibold">{progressPercent}%</span>
                                                </div>
                                                <Progress value={progressPercent} className="h-2" />
                                            </div>

                                            {/* Status badge */}
                                            {progressPercent === 0 && (
                                                <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                                                    <Circle className="w-3 h-3" />
                                                    {translations.notStarted[language]}
                                                </div>
                                            )}
                                            {progressPercent > 0 && progressPercent < 100 && (
                                                <div className="mt-3 text-xs text-blue-600 flex items-center gap-1 font-medium">
                                                    <Circle className="w-3 h-3 fill-blue-600" />
                                                    {translations.inProgress[language]}
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
                <div className="text-center text-gray-600">
                    <p className="text-sm">
                        {translations.clickToStart[language]} 🚀
                    </p>
                </div>
            </div>
        );
    };

    // Render other grades (legacy accordion view) - Static content for demo
    const renderOtherGradesContent = () => (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur min-h-[500px]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-3">
                        <Badge variant="outline" className="text-lg py-1 px-3">
                            {selectedGrade}-{translations.grade[language]}
                        </Badge>
                        {language === 'kz' ? 'Оқу материалдары' : 'Учебные материалы'}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="dictionary" className="flex items-center gap-2">
                            <Book className="size-4" />
                            {translations.dictionary[language]}
                        </TabsTrigger>
                        <TabsTrigger value="rules" className="flex items-center gap-2">
                            <FileText className="size-4" />
                            {translations.rules[language]}
                        </TabsTrigger>
                        <TabsTrigger value="materials" className="flex items-center gap-2">
                            <Library className="size-4" />
                            {translations.materials[language]}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dictionary" className="space-y-4">
                        {currentContent.dictionary.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {currentContent.dictionary.map((module, moduleIdx) => (
                                    <AccordionItem key={moduleIdx} value={`module-${moduleIdx}`} className="border rounded-lg px-4 bg-white shadow-sm">
                                        <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-bold text-lg text-blue-600">{module.id}</span>
                                                <span className="text-gray-600 font-medium">{module.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pb-4">
                                            <div className="space-y-6">
                                                {module.sections.map((section: any, sectionIdx: number) => (
                                                    <div key={sectionIdx} className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-sm font-bold bg-blue-100 text-blue-700">
                                                                {section.id}
                                                            </Badge>
                                                            <div className="h-px bg-gray-200 flex-1"></div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {section.items.map((item: any, itemIdx: number) => (
                                                                <div key={itemIdx} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                                                                    <h4 className="font-bold text-gray-900 mb-1">{item.word}</h4>
                                                                    <p className="text-blue-600 font-medium text-sm">{item.trans}</p>
                                                                    <p className="text-gray-400 text-xs italic">{item.context}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <EmptyState language={language} translations={translations} />
                        )}
                    </TabsContent>

                    <TabsContent value="rules" className="space-y-4">
                        {currentContent.rules.length > 0 ? (
                            <div className="space-y-4">
                                {currentContent.rules.map((item, idx) => (
                                    <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                                                <p className="text-gray-500">{item.desc}</p>
                                            </div>
                                            <ChevronRight className="text-gray-400" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState language={language} translations={translations} />
                        )}
                    </TabsContent>

                    <TabsContent value="materials" className="space-y-4">
                        {currentContent.materials.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentContent.materials.map((item, idx) => (
                                    <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer group">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <Library className="size-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                                <Badge variant="secondary" className="mt-1">{item.type}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState language={language} translations={translations} />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{translations.title[language]}</h1>
                            <p className="text-gray-600">{translations.subtitle[language]}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Grade Selection */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                    {grades.map((grade) => (
                        <motion.div
                            key={grade}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                className={`cursor-pointer min-w-[120px] transition-colors ${selectedGrade === grade
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white hover:border-blue-300'
                                    }`}
                                onClick={() => setSelectedGrade(grade)}
                            >
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <GraduationCap className={`size-8 mb-2 ${selectedGrade === grade ? 'text-white' : 'text-blue-600'}`} />
                                    <span className="text-2xl font-bold">{grade}</span>
                                    <span className="text-xs opacity-80">{translations.grade[language]}</span>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Content Area - Conditional Rendering */}
                {selectedGrade === '9' ? renderGrade9Content() : renderOtherGradesContent()}
            </div>
        </div>
    );
}

function EmptyState({ language, translations }: { language: any, translations: any }) {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Lock className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                {translations.locked[language]}
            </h3>
            <p className="text-gray-500">
                {language === 'kz' ? 'Жақында қосылады...' : 'Скоро будет добавлено...'}
            </p>
        </div>
    );
}
