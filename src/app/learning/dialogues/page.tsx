'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Play, Volume2, CheckCircle, Mic, Lock, Sparkles, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dialogues } from '@/data/dialogues';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserProfileService } from '@/services/userProfileService';

export default function DialoguesPage() {
    const { language } = useLanguage();
    const [selectedDialogue, setSelectedDialogue] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [hasSpoken, setHasSpoken] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [feedbackState, setFeedbackState] = useState<'neutral' | 'correct' | 'perfect' | 'retry'>('neutral');

    // Progress State: { [dialogueId]: { completed: boolean, perfect: boolean } }
    const [progress, setProgress] = useState<Record<string, { completed: boolean, perfect: boolean }>>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dialogue_progress');
            if (saved) {
                try {
                    setProgress(JSON.parse(saved));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, []);

    const saveProgress = (dialogueId: string, isPerfect: boolean) => {
        const prev = progress[dialogueId];
        const newProgress = {
            ...progress,
            [dialogueId]: {
                completed: true,
                perfect: isPerfect || (prev?.perfect || false)
            }
        };
        setProgress(newProgress);
        localStorage.setItem('dialogue_progress', JSON.stringify(newProgress));

        // Award XP if first time perfecting or completing
        if (isPerfect && !prev?.perfect) {
            getUserProfileService().addXp(50);
            getUserProfileService().logActivity(5);
        }
    };

    // First 2 always unlocked. To unlock others, need to perfect the first 2.
    const firstTwoPerfect = dialogues.slice(0, 2).every(d => progress[d.id]?.perfect);

    const translations = {
        title: { ru: 'Диалоги', kz: 'Диалогтар' },
        subtitle: { ru: 'Практикуйте произношение и понимание', kz: 'Айтылым мен түсінуді жаттықтырыңыз' },
        selectDialogue: { ru: 'Выберите диалог', kz: 'Диалог таңдаңыз' },
        start: { ru: 'Начать', kz: 'Бастау' },
        next: { ru: 'Далее', kz: 'Келесі' },
        nextDialogue: { ru: 'Следующий диалог', kz: 'Келесі диалог' },
        complete: { ru: 'Завершить', kz: 'Аяқтау' },
        completed: { ru: 'Отлично!', kz: 'Тамаша!' },
        messages: { ru: 'фраз', kz: 'фраза' },
        speak: { ru: 'Говорите', kz: 'Сөйлеңіз' },
        listening: { ru: 'Слушаю...', kz: 'Тыңдау...' },
        locked: { ru: 'Заблокировано (Пройдите первые 2 на отлично)', kz: 'Құлыптаулы (Алғашқы 2-уін үздік аяқтаңыз)' },
        perfect: { ru: 'Идеально!', kz: 'Өте жақсы!' },
        retry: { ru: 'Попробуйте еще раз', kz: 'Қайталап көріңіз' }
    };

    const handleSelectDialogue = (dialogue: any) => {
        if (isLocked(dialogue)) return;
        setSelectedDialogue(dialogue);
        setCurrentStep(0);
        setHasSpoken(false);
        setFeedbackState('neutral');
        setRecognizedText('');
    };

    const isLocked = (dialogue: any) => {
        const index = dialogues.findIndex(d => d.id === dialogue.id);
        if (index < 2) return false;
        return !firstTwoPerfect;
    };

    const handleNext = () => {
        if (currentStep < selectedDialogue.messages.length - 1) {
            setCurrentStep(prev => prev + 1);
            setHasSpoken(false);
            setFeedbackState('neutral');
            setRecognizedText('');
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        saveProgress(selectedDialogue.id, true);

        // Find next dialogue
        const currentIndex = dialogues.findIndex(d => d.id === selectedDialogue.id);
        const nextDialogue = dialogues[currentIndex + 1];

        // Logic to open next dialogue automatically or show "Next" button
        if (nextDialogue) {
            // Auto open next
            setTimeout(() => {
                setSelectedDialogue(nextDialogue);
                setCurrentStep(0);
                setHasSpoken(false);
                setRecognizedText('');
                setFeedbackState('neutral');
            }, 500);
        } else {
            // End of all dialogues - return to menu
            setSelectedDialogue(null);
            setCurrentStep(0);
            setHasSpoken(false);
            setRecognizedText('');
            setFeedbackState('neutral');
        }
    };

    const playAudio = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (selectedDialogue) {
            const currentMessage = selectedDialogue.messages[currentStep];
            if (currentMessage && currentMessage.speaker === 'bot') {
                const timer = setTimeout(() => {
                    playAudio(currentMessage.text);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [currentStep, selectedDialogue]);

    // Normalize text for comparison
    const normalizeText = (text: string) => {
        return text.toLowerCase()
            .replace(/['’]m/g, ' am')
            .replace(/['’]re/g, ' are')
            .replace(/['’]s/g, ' is')
            .replace(/['’]t/g, ' not')
            .replace(/['’]ll/g, ' will')
            .replace(/['’]ve/g, ' have')
            .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
            .trim()
            .replace(/\s+/g, ' '); // Collaps spaces
    };

    const calculateSimilarity = (spoken: string, expected: string) => {
        const s1 = normalizeText(spoken);
        const s2 = normalizeText(expected);

        if (s1 === s2) return 1;
        if (s1.includes(s2) || s2.includes(s1)) return 0.9;

        const words1 = s1.split(' ');
        const words2 = s2.split(' ');
        const intersection = words1.filter(w => words2.includes(w));
        const overlap = intersection.length / Math.max(words1.length, words2.length);

        return overlap;
    };

    const handleRecord = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition not supported');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
            setRecognizedText('');
            setFeedbackState('neutral');
        };

        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            setRecognizedText(speechResult);
            setIsRecording(false);
            setHasSpoken(true);

            const currentMessage = selectedDialogue.messages[currentStep];
            const similarity = calculateSimilarity(speechResult, currentMessage.text);

            if (similarity >= 0.7) { // 70% match is enough
                setFeedbackState('perfect');
                setTimeout(() => {
                    const isLast = currentStep === selectedDialogue.messages.length - 1;
                    if (isLast) handleComplete();
                    else handleNext();
                }, 1500);
            } else {
                setFeedbackState('retry');
            }
        };

        recognition.onerror = () => {
            setIsRecording(false);
            setFeedbackState('retry');
        };

        recognition.start();
    };

    if (selectedDialogue) {
        const currentMessage = selectedDialogue.messages[currentStep];
        const isBot = currentMessage.speaker === 'bot';
        const progressPercent = ((currentStep + 1) / selectedDialogue.messages.length) * 100;

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setSelectedDialogue(null)}
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            ← Back
                        </button>
                        <div className="text-sm font-medium text-gray-400">
                            {currentStep + 1} / {selectedDialogue.messages.length}
                        </div>
                    </div>

                    <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="mb-6">
                                {isBot ? (
                                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 animate-bounce-slow">
                                        <MessageSquare className="w-10 h-10" />
                                    </div>
                                ) : (
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${feedbackState === 'perfect' ? 'bg-green-100 text-green-600' :
                                        feedbackState === 'retry' ? 'bg-red-100 text-red-600' :
                                            isRecording ? 'bg-red-100 text-red-600 animate-pulse' :
                                                'bg-purple-100 text-purple-600'
                                        }`}>
                                        {feedbackState === 'perfect' ? <Sparkles className="w-10 h-10" /> :
                                            <Mic className="w-10 h-10" />}
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                {currentMessage.text}
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                                {currentMessage.translation[language]}
                            </p>

                            <div className="flex flex-col items-center gap-4 w-full">
                                {isBot ? (
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => playAudio(currentMessage.text)}
                                            variant="outline"
                                            className="rounded-full px-8 py-6 text-lg"
                                        >
                                            <Volume2 className="w-5 h-5 mr-2" />
                                            Listen Again
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            className="rounded-full px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {feedbackState === 'neutral' && !isRecording && (
                                            <Button
                                                onClick={handleRecord}
                                                className="rounded-full w-20 h-20 flex items-center justify-center bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all p-0"
                                            >
                                                <Mic className="w-8 h-8" />
                                            </Button>
                                        )}

                                        {isRecording && (
                                            <div className="text-red-500 font-medium animate-pulse">
                                                {translations.listening[language]}
                                            </div>
                                        )}

                                        {feedbackState === 'perfect' && (
                                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                                                <div className="text-green-500 font-bold text-xl mb-2">
                                                    {translations.perfect[language]}
                                                </div>
                                                <div className="text-sm text-gray-400">Matches perfectly!</div>
                                            </div>
                                        )}

                                        {feedbackState === 'retry' && (
                                            <div className="flex flex-col items-center">
                                                <div className="text-red-500 font-medium mb-3">
                                                    {translations.retry[language]}
                                                </div>
                                                <p className="text-sm text-gray-400 mb-4">You said: "{recognizedText}"</p>
                                                <Button
                                                    onClick={handleRecord}
                                                    variant="outline"
                                                    className="rounded-full"
                                                >
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Try Again
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                        {translations.title[language]}
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        {translations.subtitle[language]}
                    </p>

                    {!firstTwoPerfect && (
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                            <Lock className="w-4 h-4" />
                            To unlock advanced dialogues, please complete the first 2 perfectly.
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dialogues.map((dialogue, index) => {
                        const locked = isLocked(dialogue);
                        const isDone = progress[dialogue.id]?.perfect;

                        return (
                            <motion.div
                                key={dialogue.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div
                                    onClick={() => handleSelectDialogue(dialogue)}
                                    className={`relative group rounded-3xl overflow-hidden transition-all duration-300 ${locked
                                        ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-70'
                                        : 'bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-800'
                                        }`}
                                >
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${locked ? 'bg-gray-200 text-gray-400' :
                                                isDone ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {locked ? <Lock className="w-6 h-6" /> :
                                                    isDone ? <CheckCircle className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                                            </div>
                                            <Badge variant={locked ? "secondary" : "default"}>
                                                {dialogue.level}
                                            </Badge>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                            {dialogue.scenario}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                            Prepare yourself for: {dialogue.messages[0].text}
                                        </p>

                                        <div className="flex items-center text-sm text-gray-400 font-medium">
                                            {dialogue.messages.length} {translations.messages[language]}
                                        </div>
                                    </div>

                                    {locked && (
                                        <div className="absolute inset-0 bg-gray-50/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                                                <Lock className="w-6 h-6 text-gray-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
