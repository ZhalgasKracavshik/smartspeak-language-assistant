'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RefreshCw, Trophy } from 'lucide-react';

interface VocabularyWord {
    id: string;
    word: string;
    translation_ru: string;
    translation_kz: string;
    partOfSpeech: string;
    example: string;
    module: number;
}

interface ModuleTestProps {
    vocabulary: VocabularyWord[];
    moduleNumber: number;
}

interface Question {
    id: number;
    type: 'multiple-choice' | 'translation';
    question: string;
    options?: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
}

export default function ModuleTest({ vocabulary, moduleNumber }: ModuleTestProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [testStarted, setTestStarted] = useState(false);

    // Use ref for immediate spam prevention, state for UI updates
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset ref when index changes (new question ready)
    useEffect(() => {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }, [currentQuestionIndex]);

    const generateTest = () => {
        if (vocabulary.length < 5) return;

        const newQuestions: Question[] = [];
        // Generate 10 questions
        for (let i = 0; i < 10; i++) {
            const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
            const type = Math.random() > 0.5 ? 'multiple-choice' : 'translation';

            if (type === 'multiple-choice') {
                // Generate wrong options
                const wrongOptions = vocabulary
                    .filter(w => w.id !== randomWord.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(w => w.translation_ru); // Using RU for now, could be toggleable

                const options = [...wrongOptions, randomWord.translation_ru].sort(() => 0.5 - Math.random());

                newQuestions.push({
                    id: i,
                    type: 'multiple-choice',
                    question: `Choose the correct translation for: "${randomWord.word}"`,
                    options,
                    correctAnswer: randomWord.translation_ru
                });
            } else {
                // Translation question (type the word)
                newQuestions.push({
                    id: i,
                    type: 'translation',
                    question: `Translate to English: "${randomWord.translation_ru}"`,
                    correctAnswer: randomWord.word
                });
            }
        }
        setQuestions(newQuestions);
        setTestStarted(true);
        setShowResults(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    };

    const handleAnswer = (answer: string) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = {
            ...currentQuestion,
            userAnswer: answer,
            isCorrect
        };

        setQuestions(updatedQuestions);
        if (isCorrect) setScore(prev => prev + 1);

        // Wait a bit then move to next
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setShowResults(true);
                saveResult(score + (isCorrect ? 1 : 0));
            }
        }, 1000);
    };

    const saveResult = (finalScore: number) => {
        const percentage = Math.round((finalScore / questions.length) * 100);
        const history = JSON.parse(localStorage.getItem(`grade9_module_${moduleNumber}_tests`) || '[]');
        history.push({
            date: new Date().toISOString(),
            score: percentage,
            totalQuestions: questions.length
        });
        localStorage.setItem(`grade9_module_${moduleNumber}_tests`, JSON.stringify(history));
    };

    if (!testStarted) {
        return (
            <div className="text-center py-12">
                <button
                    onClick={generateTest}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                    Start Test
                </button>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                    The test consists of 10 questions covering vocabulary from this module.
                </p>
            </div>
        );
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                <div className="mb-6 flex justify-center">
                    {percentage >= 80 ? (
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Trophy className="w-12 h-12 text-yellow-500" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                            <Check className="w-12 h-12 text-blue-500" />
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Test Complete!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    You scored {score} out of {questions.length} ({percentage}%)
                </p>

                <div className="grid grid-cols-1 gap-4 mb-8 text-left max-h-60 overflow-y-auto">
                    {questions.map((q, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${q.isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'}`}>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{q.question}</p>
                            <div className="flex justify-between text-sm mt-1">
                                <span className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                    Your answer: {q.userAnswer}
                                </span>
                                {!q.isCorrect && (
                                    <span className="text-green-600">Correct: {q.correctAnswer}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={generateTest}
                    className="flex items-center justify-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];

    if (!currentQ) {
        return (
            <div className="flex justify-center items-center py-20">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        {currentQ.question}
                    </h3>

                    {currentQ.type === 'multiple-choice' ? (
                        <div className="grid grid-cols-1 gap-3">
                            {currentQ.options?.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !currentQ.userAnswer && handleAnswer(option)}
                                    disabled={!!currentQ.userAnswer}
                                    className={`p-4 rounded-xl text-left transition-all ${currentQ.userAnswer
                                        ? option === currentQ.correctAnswer
                                            ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                            : option === currentQ.userAnswer
                                                ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                                : 'bg-gray-50 text-gray-400 dark:bg-gray-700/50'
                                        : 'bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent dark:bg-gray-700 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Type your answer..."
                                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-blue-500 outline-none transition-colors"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !currentQ.userAnswer) {
                                        handleAnswer((e.target as HTMLInputElement).value);
                                    }
                                }}
                                disabled={!!currentQ.userAnswer}
                            />
                            <button
                                onClick={(e) => {
                                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                    if (!currentQ.userAnswer) handleAnswer(input.value);
                                }}
                                disabled={!!currentQ.userAnswer}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                Submit
                            </button>
                            {currentQ.userAnswer && (
                                <div className={`mt-4 p-4 rounded-lg ${currentQ.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {currentQ.isCorrect ? 'Correct!' : `Incorrect. The answer was: ${currentQ.correctAnswer}`}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
