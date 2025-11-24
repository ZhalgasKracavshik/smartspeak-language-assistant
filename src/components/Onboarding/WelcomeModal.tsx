import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getUserProfileService, type UserProfile } from '../../services/userProfileService';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LEVELS = [
    { value: 'A1', label: 'A1 - Начинающий', description: 'Базовые фразы и слова' },
    { value: 'A2', label: 'A2 - Элементарный', description: 'Простые разговоры' },
    { value: 'B1', label: 'B1 - Средний', description: 'Повседневное общение' },
    { value: 'B2', label: 'B2 - Выше среднего', description: 'Свободное общение' },
    { value: 'C1', label: 'C1 - Продвинутый', description: 'Профессиональный уровень' },
    { value: 'C2', label: 'C2 - Мастерство', description: 'Владение как родным' },
] as const;

const INTERESTS = [
    { id: 'sports', label: 'Спорт', emoji: '⚽' },
    { id: 'music', label: 'Музыка', emoji: '🎵' },
    { id: 'tech', label: 'Технологии', emoji: '💻' },
    { id: 'travel', label: 'Путешествия', emoji: '✈️' },
    { id: 'movies', label: 'Кино и сериалы', emoji: '🎬' },
    { id: 'science', label: 'Наука', emoji: '🔬' },
    { id: 'art', label: 'Искусство', emoji: '🎨' },
    { id: 'games', label: 'Игры', emoji: '🎮' },
    { id: 'fashion', label: 'Мода', emoji: '👗' },
    { id: 'cooking', label: 'Кулинария', emoji: '🍳' },
];

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
    const [step, setStep] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState<UserProfile['level']>('B1');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const userProfileService = getUserProfileService();

    const handleInterestToggle = (interestId: string) => {
        setSelectedInterests(prev =>
            prev.includes(interestId)
                ? prev.filter(id => id !== interestId)
                : [...prev, interestId]
        );
    };

    const handleComplete = () => {
        userProfileService.completeOnboarding(selectedLevel, selectedInterests);
        onClose();
    };

    const handleSkip = () => {
        // Set default values if user skips
        userProfileService.completeOnboarding('B1', []);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-2xl"
                >
                    <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <button
                                onClick={handleSkip}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                            <h2 className="text-2xl font-bold mb-2">
                                {step === 1 ? '👋 Добро пожаловать в SmartSpeak!' : '🎯 Ваши интересы'}
                            </h2>
                            <p className="text-blue-100">
                                {step === 1
                                    ? 'Давайте настроим ваш опыт обучения'
                                    : 'Выберите темы, которые вам интересны'}
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="px-6 pt-4">
                            <div className="flex items-center gap-2 mb-6">
                                <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                            Выберите ваш уровень английского:
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {LEVELS.map((level) => (
                                                <button
                                                    key={level.value}
                                                    onClick={() => setSelectedLevel(level.value as UserProfile['level'])}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedLevel === level.value
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-200 hover:border-blue-300 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-gray-900">{level.label}</span>
                                                        {selectedLevel === level.value && (
                                                            <Check className="size-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{level.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                            Выберите интересы (минимум 3):
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Мы подберем контент специально для вас
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {INTERESTS.map((interest) => (
                                                <button
                                                    key={interest.id}
                                                    onClick={() => handleInterestToggle(interest.id)}
                                                    className={`p-4 rounded-xl border-2 text-center transition-all ${selectedInterests.includes(interest.id)
                                                            ? 'border-purple-600 bg-purple-50'
                                                            : 'border-gray-200 hover:border-purple-300 bg-white'
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-2">{interest.emoji}</div>
                                                    <div className="font-medium text-sm text-gray-900">{interest.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex items-center justify-between">
                            {step === 2 && (
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <ChevronLeft className="size-4" />
                                    Назад
                                </Button>
                            )}
                            {step === 1 ? (
                                <Button
                                    onClick={() => setStep(2)}
                                    className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                                >
                                    Далее
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleComplete}
                                    disabled={selectedInterests.length < 3}
                                    className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                                >
                                    Завершить
                                    <Check className="size-4" />
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
