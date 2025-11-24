import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Gamepad2, Palette, Film, Book, Plane, Code, Coffee, Check, Microscope, Landmark, Trophy, Trees, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { getUserProfileService } from '../services/userProfileService';

interface OnboardingProps {
    onComplete: () => void;
}

const INTERESTS = [
    { id: 'music', label: 'Music', icon: Music, color: 'bg-pink-100 text-pink-600' },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-purple-100 text-purple-600' },
    { id: 'art', label: 'Art & Creativity', icon: Palette, color: 'bg-orange-100 text-orange-600' },
    { id: 'movies', label: 'Movies & TV', icon: Film, color: 'bg-blue-100 text-blue-600' },
    { id: 'books', label: 'Reading', icon: Book, color: 'bg-green-100 text-green-600' },
    { id: 'travel', label: 'Travel', icon: Plane, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'tech', label: 'Technology', icon: Code, color: 'bg-slate-100 text-slate-600' },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'science', label: 'Science', icon: Microscope, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'history', label: 'History', icon: Landmark, color: 'bg-amber-100 text-amber-600' },
    { id: 'sports', label: 'Sports', icon: Trophy, color: 'bg-red-100 text-red-600' },
    { id: 'nature', label: 'Nature', icon: Trees, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'bg-gray-100 text-gray-600' },
];

const LEVELS = [
    { id: 'A1', label: 'Beginner', desc: 'I can understand basic phrases' },
    { id: 'A2', label: 'Elementary', desc: 'I can communicate in simple tasks' },
    { id: 'B1', label: 'Intermediate', desc: 'I can deal with most situations' },
    { id: 'B2', label: 'Upper Intermediate', desc: 'I speak fluently and spontaneously' },
    { id: 'C1', label: 'Advanced', desc: 'I can express ideas fluently' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<any>('A1');

    const toggleInterest = (id: string) => {
        if (selectedInterests.includes(id)) {
            setSelectedInterests(selectedInterests.filter(i => i !== id));
        } else {
            if (selectedInterests.length < 5) {
                setSelectedInterests([...selectedInterests, id]);
            }
        }
    };

    const handleComplete = () => {
        getUserProfileService().completeOnboarding(selectedLevel, selectedInterests);
        onComplete();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-xl border-0">
                <CardContent className="p-8">
                    {step === 1 ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">What are you interested in? 🎯</h1>
                                <p className="text-gray-500">Select up to 5 topics. We'll use this to personalize your learning.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {INTERESTS.map((interest) => {
                                    const isSelected = selectedInterests.includes(interest.id);
                                    const Icon = interest.icon;
                                    return (
                                        <motion.button
                                            key={interest.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleInterest(interest.id)}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full ${interest.color}`}>
                                                <Icon className="size-6" />
                                            </div>
                                            <span className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                                {interest.label}
                                            </span>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5">
                                                    <Check className="size-3 text-white" />
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    size="lg"
                                    onClick={() => setStep(2)}
                                    disabled={selectedInterests.length === 0}
                                    className="w-full md:w-auto"
                                >
                                    Continue
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your English level? 📊</h1>
                                <p className="text-gray-500">This helps us adjust the difficulty of your exercises.</p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {LEVELS.map((level) => (
                                    <motion.button
                                        key={level.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedLevel(level.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${selectedLevel === level.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-100 hover:border-blue-200 bg-white'
                                            }`}
                                    >
                                        <div>
                                            <span className={`font-bold text-lg ${selectedLevel === level.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                                {level.id} - {level.label}
                                            </span>
                                            <p className="text-gray-500 text-sm mt-1">{level.desc}</p>
                                        </div>
                                        {selectedLevel === level.id && (
                                            <div className="bg-blue-500 rounded-full p-1">
                                                <Check className="size-4 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button size="lg" onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                                    Start Learning 🚀
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
