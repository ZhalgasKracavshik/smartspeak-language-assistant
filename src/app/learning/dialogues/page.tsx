'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Play, Volume2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dialogues } from '@/data/dialogues';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DialoguesPage() {
    const { language } = useLanguage();
    const [selectedDialogue, setSelectedDialogue] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0);

    const translations = {
        title: { ru: 'Диалоги', kz: 'Диалогтар' },
        subtitle: { ru: 'Практикуйте реальные разговоры', kz: 'Нағыз әңгімелерді жаттықтырыңыз' },
        selectDialogue: { ru: 'Выберите диалог', kz: 'Диалог таңдаңыз' },
        start: { ru: 'Начать', kz: 'Бастау' },
        next: { ru: 'Далее', kz: 'Келесі' },
        complete: { ru: 'Завершить', kz: 'Аяқтау' },
        completed: { ru: 'Завершено!', kz: 'Аяқталды!' },
        messages: { ru: 'сообщений', kz: 'хабарлар' }
    };

    const handleSelectDialogue = (dialogue: any) => {
        setSelectedDialogue(dialogue);
        setCurrentStep(0);
    };

    const handleNext = () => {
        if (currentStep < selectedDialogue.messages.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleComplete = () => {
        setSelectedDialogue(null);
        setCurrentStep(0);
    };

    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    if (selectedDialogue) {
        const currentMessage = selectedDialogue.messages[currentStep];
        const isLastStep = currentStep === selectedDialogue.messages.length - 1;

        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">{selectedDialogue.scenario}</CardTitle>
                                        <Badge variant="outline">{selectedDialogue.level}</Badge>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700">
                                        {currentStep + 1} / {selectedDialogue.messages.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-600 text-white p-3 rounded-full">
                                            <MessageSquare className="size-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-blue-800 mb-2 capitalize">
                                                {currentMessage.speaker === 'bot' ? 'Assistant' : 'You'}
                                            </p>
                                            <p className="text-lg text-gray-900 mb-2">{currentMessage.text}</p>
                                            <p className="text-sm text-gray-600">
                                                {currentMessage.translation[language]}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => playAudio(currentMessage.text)}
                                            >
                                                <Volume2 className="size-4 mr-2" />
                                                Listen
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={isLastStep ? handleComplete : handleNext}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                        size="lg"
                                    >
                                        {isLastStep ? (
                                            <>
                                                <CheckCircle className="size-5 mr-2" />
                                                {translations.complete[language]}
                                            </>
                                        ) : (
                                            <>
                                                {translations.next[language]}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6 md:p-8 pb-20 md:pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        {translations.title[language]}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {translations.subtitle[language]}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dialogues.slice(0, 20).map((dialogue, index) => (
                        <motion.div
                            key={dialogue.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden h-full bg-white/90 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                            <MessageSquare className="size-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                                                {dialogue.scenario}
                                            </h3>
                                            <Badge variant="outline" className="mb-2">
                                                {dialogue.level}
                                            </Badge>
                                            <p className="text-sm text-gray-600">
                                                {dialogue.messages.length} {translations.messages[language]}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleSelectDialogue(dialogue)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        <Play className="size-4 mr-2" />
                                        {translations.start[language]}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
