'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowRight, ArrowLeft, Shuffle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VocabularyWord {
    id: string;
    word: string;
    translation_ru: string;
    translation_kz: string;
    example: string;
}

interface ModulePracticeProps {
    vocabulary: VocabularyWord[];
}

export default function ModulePractice({ vocabulary }: ModulePracticeProps) {
    const [mode, setMode] = useState<'flashcards' | 'matching'>('flashcards');

    return (
        <div className="space-y-6">
            {/* Mode Selection */}
            <div className="flex justify-center space-x-4 mb-8">
                <Button
                    variant={mode === 'flashcards' ? 'default' : 'outline'}
                    onClick={() => setMode('flashcards')}
                    className="w-32"
                >
                    Flashcards
                </Button>
                <Button
                    variant={mode === 'matching' ? 'default' : 'outline'}
                    onClick={() => setMode('matching')}
                    className="w-32"
                >
                    Matching
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'flashcards' ? (
                    <Flashcards key="flashcards" words={vocabulary} />
                ) : (
                    <MatchingGame key="matching" words={vocabulary} />
                )}
            </AnimatePresence>
        </div>
    );
}

function Flashcards({ words }: { words: VocabularyWord[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [shuffledWords, setShuffledWords] = useState(words);

    useEffect(() => {
        setShuffledWords([...words].sort(() => Math.random() - 0.5));
    }, [words]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
        }, 200);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length);
        }, 200);
    };

    const currentWord = shuffledWords[currentIndex];

    return (
        <div className="max-w-md mx-auto perspective-1000">
            <div className="text-center mb-4 text-gray-500">
                Card {currentIndex + 1} of {shuffledWords.length}
            </div>

            <div
                className="relative h-80 w-full cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-100 dark:border-blue-900">
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{currentWord?.word}</h3>
                        <p className="text-sm text-gray-400">Click to flip</p>
                    </Card>

                    {/* Back */}
                    <Card
                        className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-blue-50 dark:bg-gray-800 shadow-lg border-2 border-blue-200 dark:border-blue-800"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <div className="space-y-4 text-center">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Russian</span>
                                <p className="text-2xl font-medium text-gray-900 dark:text-white">{currentWord?.translation_ru}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Kazakh</span>
                                <p className="text-2xl font-medium text-gray-900 dark:text-white">{currentWord?.translation_kz}</p>
                            </div>
                            <div className="pt-4 border-t border-blue-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-300 italic">"{currentWord?.example}"</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className="flex justify-between mt-8">
                <Button onClick={handlePrev} variant="outline" size="icon">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button onClick={() => {
                    setIsFlipped(false);
                    setShuffledWords([...words].sort(() => Math.random() - 0.5));
                    setCurrentIndex(0);
                }} variant="ghost" size="icon" title="Shuffle">
                    <Shuffle className="w-4 h-4" />
                </Button>
                <Button onClick={handleNext} variant="outline" size="icon">
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

function MatchingGame({ words }: { words: VocabularyWord[] }) {
    const [gameItems, setGameItems] = useState<{ id: string; text: string; type: 'word' | 'translation'; matched: boolean }[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [matchedCount, setMatchedCount] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        startNewGame();
    }, [words]);

    const startNewGame = () => {
        // Pick 6 random words
        const randomWords = [...words].sort(() => Math.random() - 0.5).slice(0, 6);

        const items = randomWords.flatMap(w => [
            { id: w.id, text: w.word, type: 'word' as const, matched: false },
            { id: w.id, text: w.translation_ru, type: 'translation' as const, matched: false }
        ]);

        setGameItems(items.sort(() => Math.random() - 0.5));
        setMatchedCount(0);
        setIsComplete(false);
        setSelected(null);
    };

    const handleItemClick = (index: number) => {
        if (gameItems[index].matched) return;

        if (selected === null) {
            setSelected(index);
        } else {
            if (selected === index) {
                setSelected(null);
                return;
            }

            const item1 = gameItems[selected];
            const item2 = gameItems[index];

            if (item1.id === item2.id && item1.type !== item2.type) {
                // Match!
                const newItems = [...gameItems];
                newItems[selected].matched = true;
                newItems[index].matched = true;
                setGameItems(newItems);
                setSelected(null);
                setMatchedCount(prev => {
                    const newCount = prev + 1;
                    if (newCount === 6) setIsComplete(true);
                    return newCount;
                });
            } else {
                // No match
                setSelected(index); // Just switch selection to the new item, or could deselect both
                // For better UX, maybe flash red, but simple switch is okay for now
                setTimeout(() => setSelected(null), 500);
            }
        }
    };

    if (isComplete) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Great Job!</h3>
                <p className="text-gray-600 mb-8">You matched all the words correctly.</p>
                <Button onClick={startNewGame} size="lg">
                    Play Again <RefreshCw className="w-4 h-4 ml-2" />
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500">Match the pairs ({matchedCount}/6)</p>
                <Button onClick={startNewGame} variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Restart
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gameItems.map((item, index) => (
                    <motion.button
                        key={`${item.id}-${item.type}-${index}`}
                        layout
                        onClick={() => handleItemClick(index)}
                        className={`
              p-4 rounded-xl text-sm font-medium transition-all duration-200 min-h-[80px] flex items-center justify-center text-center
              ${item.matched
                                ? 'bg-green-50 text-green-400 border-2 border-green-100 cursor-default opacity-50'
                                : selected === index
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 shadow-md scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 hover:shadow-sm'
                            }
            `}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item.matched ? <Check className="w-5 h-5" /> : item.text}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
