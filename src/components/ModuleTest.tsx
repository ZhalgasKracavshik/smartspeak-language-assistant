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

import { PracticeQuestion } from '@/services/contentService';

interface ModuleTestProps {
    vocabulary: VocabularyWord[];
    moduleNumber: number;
    practiceQuestions?: PracticeQuestion[];
}

interface Question {
    id: number;
    type: 'multiple-choice' | 'translation' | 'text';
    question: string;
    options?: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
}

export default function ModuleTest({ vocabulary, moduleNumber, practiceQuestions = [] }: ModuleTestProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [testStarted, setTestStarted] = useState(false);

    // Use ref for immediate spam prevention, state for UI updates
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // localStorage key for this module's in-progress test
    const progressKey = `grade9_module_${moduleNumber}_progress`;

    // Restore progress on mount
    useEffect(() => {
        const saved = localStorage.getItem(progressKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                    setCurrentQuestionIndex(data.currentQuestionIndex || 0);
                    setScore(data.score || 0);
                    setTestStarted(true);
                    setShowResults(false);
                }
            } catch (e) {
                console.error('Failed to restore test progress:', e);
                localStorage.removeItem(progressKey);
            }
        }
    }, [progressKey]);

    // Reset ref when index changes (new question ready)
    useEffect(() => {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }, [currentQuestionIndex]);

    // Save progress whenever state changes during active test
    useEffect(() => {
        if (testStarted && !showResults && questions.length > 0) {
            localStorage.setItem(progressKey, JSON.stringify({
                questions,
                currentQuestionIndex,
                score
            }));
        }
    }, [questions, currentQuestionIndex, score, testStarted, showResults, progressKey]);

    const clearProgress = () => {
        localStorage.removeItem(progressKey);
    };

    const generateTest = () => {
        clearProgress();

        const newQuestions: Question[] = [];
        let idCounter = 0;

        // 1. HARDCODED STANDARD ENGLISH QUESTIONS (Punctuation, Grammar Standards)
        const standardQuestions: Question[] = [
            // --- Tricky Punctuation (Dashes vs Semicolons) ---
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Which sentence correctly uses a colon?',
                options: [
                    'I have three sisters: Amy, Beth, and Jo.',
                    'I have: three sisters Amy, Beth, and Jo.',
                    'I have three sisters Amy: Beth, and Jo.',
                    'I have three sisters Amy, Beth, and: Jo.'
                ],
                correctAnswer: 'I have three sisters: Amy, Beth, and Jo.'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Choose the sentence with correct punctuation:',
                options: [
                    'Its a nice day, isn\'t it?',
                    'It\'s a nice day, isn\'t it?',
                    'Its a nice day isn\'t it?',
                    'It\'s a nice day isnt it?'
                ],
                correctAnswer: 'It\'s a nice day, isn\'t it?'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'When do you use a semi-colon (;)?',
                options: [
                    'To end a sentence.',
                    'To join two independent clauses that are closely related.',
                    'To list items.',
                    'To show possession.'
                ],
                correctAnswer: 'To join two independent clauses that are closely related.'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Identify the correct use of "their", "there", and "they\'re":',
                options: [
                    'They\'re going towards their house.',
                    'There going towards they\'re house.',
                    'Their going towards there house.',
                    'They\'re going towards there house.'
                ],
                correctAnswer: 'They\'re going towards their house.'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Which sentence implies an abrupt break in thought?',
                options: [
                    'I need to buy apples, oranges, and bananas.',
                    'I need to buy apples; however, I forgot my wallet.',
                    'I need to buy apples—wait, I already have some!',
                    'I need to buy (apples) and bananas.'
                ],
                correctAnswer: 'I need to buy apples—wait, I already have some!'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Choose the correct sentence:',
                options: [
                    'The meeting was long; boring and pointless.',
                    'The meeting was long, boring, and pointless.',
                    'The meeting was long: boring and pointless.',
                    'The meeting was long—boring; and pointless.'
                ],
                correctAnswer: 'The meeting was long, boring, and pointless.'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Select the sentence where the semi-colon is used correctly:',
                options: [
                    'I love ice cream; especially vanilla.',
                    'The store was closed; we went home.',
                    'Because it was raining; we stayed inside.',
                    'I have a dog; cat, and fish.'
                ],
                correctAnswer: 'The store was closed; we went home.'
            },
            {
                id: idCounter++,
                type: 'multiple-choice',
                question: 'Which sentence correctly uses an em-dash?',
                options: [
                    'My friends-Sarah and John-are here.',
                    'My friends: Sarah and John—are here.',
                    'My friends—Sarah and John—are here.',
                    'My friends; Sarah and John—are here.'
                ],
                correctAnswer: 'My friends—Sarah and John—are here.'
            }
        ];

        // Add 3 random standard questions (increased from 2)
        newQuestions.push(...standardQuestions.sort(() => 0.5 - Math.random()).slice(0, 3));

        // 2. Practice Questions from DB (Forced Text)
        if (practiceQuestions && practiceQuestions.length > 0) {
            practiceQuestions.forEach(pq => {
                newQuestions.push({
                    id: idCounter++,
                    type: 'text',
                    question: pq.question_en,
                    correctAnswer: pq.answer_key || '',
                    userAnswer: undefined
                });
            });
        }

        // 3. Vocabulary Questions (Hard Mode)
        // Filter for "harder" words (longer length)
        const hardVocab = vocabulary.filter(w => w.word.length > 5);
        const pool = hardVocab.length >= 5 ? hardVocab : vocabulary;

        // Ensure we don't exceed 10 questions total if we already have many from steps 1 & 2
        const currentCount = newQuestions.length;
        const remainingSlots = 10 - currentCount;

        if (pool.length >= 5 && remainingSlots > 0) {
            for (let i = 0; i < remainingSlots; i++) {
                const randomWord = pool[Math.floor(Math.random() * pool.length)];

                // User Request: "Make it so there is an input field and user enters correct translation"
                // Increasing Text Input probability to 80% for challenging tests
                const isWriteTask = Math.random() > 0.2;

                if (isWriteTask) {
                    newQuestions.push({
                        id: idCounter++,
                        type: 'text', // Strict writing
                        question: `Translate to English: "${randomWord.translation_ru}"`,
                        correctAnswer: randomWord.word
                    });
                } else {
                    // Multiple Choice with Smart Distractors
                    // Attempt to find words with similar length or starting letter to confuse user
                    const similarWords = vocabulary
                        .filter(w => w.id !== randomWord.id && Math.abs(w.word.length - randomWord.word.length) <= 2)
                        .slice(0, 3);

                    let wrongOptions: string[];

                    if (similarWords.length >= 3) {
                        wrongOptions = similarWords.map(w => w.translation_ru);
                    } else {
                        // Fallback to random if no similar words found
                        wrongOptions = vocabulary
                            .filter(w => w.id !== randomWord.id)
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 3)
                            .map(w => w.translation_ru);
                    }

                    const options = [...wrongOptions, randomWord.translation_ru].sort(() => 0.5 - Math.random());

                    newQuestions.push({
                        id: idCounter++,
                        type: 'multiple-choice',
                        question: `Choose the correct translation for: "${randomWord.word}"`,
                        options,
                        correctAnswer: randomWord.translation_ru
                    });
                }
            }
        }

        // Shuffle all questions so standard/vocab/practice are mixed
        const shuffledQuestions = newQuestions.sort(() => 0.5 - Math.random());

        // Ensure IDs are sequential after shuffle (optional, but good for "Question 1 of 10")
        // Actually, better to keep distinct IDs, just slice if needed.
        const finalQuestions = shuffledQuestions.slice(0, 10);

        if (finalQuestions.length === 0) return;

        setQuestions(finalQuestions);
        setTestStarted(true);
        setShowResults(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    };

    const handleAnswer = async (answer: string) => {
        if (isSubmittingRef.current) return;

        // Safety check for empty/null answer
        if (!answer) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        const currentQuestion = questions[currentQuestionIndex];
        let isCorrect = false;

        // --- AI VERIFICATION FOR TEXT ANSWERS ---
        if (currentQuestion.type === 'text' || currentQuestion.type === 'translation') {
            try {
                // Optimistic check first (exact match)
                if (answer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()) {
                    isCorrect = true;
                } else {
                    // Call API for semantic check
                    const response = await fetch('/api/test/check', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            question: currentQuestion.question,
                            userAnswer: answer,
                            correctAnswer: currentQuestion.correctAnswer
                        })
                    });
                    const data = await response.json();
                    isCorrect = data.isCorrect;
                }
            } catch (error) {
                console.error("AI Check Failed, falling back to strict match", error);
                isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
            }
        } else {
            // Standard Multiple Choice Check
            isCorrect = answer === currentQuestion.correctAnswer;
        }

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
        }, 1500); // Slightly longer delay to read feedback
    };

    const saveResult = (finalScore: number) => {
        const percentage = Math.round((finalScore / questions.length) * 100);

        // 1. Save Test History
        const history = JSON.parse(localStorage.getItem(`grade9_module_${moduleNumber}_tests`) || '[]');
        history.push({
            date: new Date().toISOString(),
            score: percentage,
            totalQuestions: questions.length
        });
        localStorage.setItem(`grade9_module_${moduleNumber}_tests`, JSON.stringify(history));

        // 2. Update Main Dashboard Progress (Fixes 0% bug)
        const dashboardProgress = JSON.parse(localStorage.getItem('grade9-progress') || '{}');

        if (!dashboardProgress[moduleNumber]) {
            dashboardProgress[moduleNumber] = {
                moduleId: moduleNumber,
                wordsLearned: [],
                grammarCompleted: [],
                testScore: 0,
                markedComplete: false
            };
        }

        // Only overwrite if new score is higher
        const currentBest = dashboardProgress[moduleNumber].testScore || 0;
        if (percentage > currentBest) {
            dashboardProgress[moduleNumber].testScore = percentage;
        }

        // Mark complete if > 70%
        if (percentage >= 70) {
            dashboardProgress[moduleNumber].markedComplete = true;
        }

        localStorage.setItem('grade9-progress', JSON.stringify(dashboardProgress));

        // Clear in-progress data since test is complete
        clearProgress();
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
