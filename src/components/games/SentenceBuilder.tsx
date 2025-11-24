import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';

// Simple sentence data
const sentences = [
    {
        id: '1',
        text: 'I am learning English every day',
        translation: { kz: 'Мен күн сайын ағылшын тілін үйренемін', ru: 'Я учу английский каждый день' },
        level: 'A1'
    },
    {
        id: '2',
        text: 'She likes to read books',
        translation: { kz: 'Ол кітап оқығанды ұнатады', ru: 'Она любит читать книги' },
        level: 'A1'
    },
    {
        id: '3',
        text: 'Where are you from',
        translation: { kz: 'Сіз қайдансыз', ru: 'Откуда вы' },
        level: 'A1'
    },
    {
        id: '4',
        text: 'I have been waiting for two hours',
        translation: { kz: 'Мен екі сағат бойы күтіп тұрмын', ru: 'Я жду уже два часа' },
        level: 'B1'
    }
];

interface SortableWordProps {
    id: string;
    word: string;
}

function SortableWord({ id, word }: SortableWordProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`px-4 py-2 bg-white border-2 border-blue-100 rounded-xl shadow-sm font-medium text-gray-700 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all select-none ${isDragging ? 'opacity-50 scale-105' : ''}`}
        >
            {word}
        </div>
    );
}

export function SentenceBuilder() {
    const { language } = useLanguage();
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [items, setItems] = useState<{ id: string, word: string }[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadSentence(currentSentenceIndex);
    }, [currentSentenceIndex]);

    const loadSentence = (index: number) => {
        const sentence = sentences[index];
        const words = sentence.text.split(' ');
        // Shuffle words
        const shuffled = words.map((word, idx) => ({
            id: `${word}-${idx}`,
            word: word
        })).sort(() => Math.random() - 0.5);

        setItems(shuffled);
        setIsCorrect(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const checkAnswer = () => {
        const currentSentence = sentences[currentSentenceIndex];
        const userSentence = items.map(i => i.word).join(' ');

        if (userSentence === currentSentence.text) {
            setIsCorrect(true);
            setScore(prev => prev + 10);
        } else {
            setIsCorrect(false);
        }
    };

    const nextSentence = () => {
        if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex(prev => prev + 1);
        } else {
            // Game Over / Reset
            alert(language === 'kz' ? `Ойын аяқталды! Ұпай: ${score}` : `Игра окончена! Счет: ${score}`);
            setCurrentSentenceIndex(0);
            setScore(0);
        }
    };

    const currentSentence = sentences[currentSentenceIndex];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                    <Trophy className="size-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sentence Builder</h2>
                <p className="text-gray-600">
                    {language === 'kz' ? 'Сөздерді дұрыс ретпен орналастырыңыз' : 'Расставьте слова в правильном порядке'}
                </p>
                <div className="mt-4 inline-block bg-yellow-100 px-4 py-1 rounded-full text-yellow-700 font-bold">
                    Score: {score}
                </div>
            </motion.div>

            <Card className={`border-0 shadow-xl transition-colors duration-500 ${isCorrect === true ? 'bg-green-50' :
                isCorrect === false ? 'bg-red-50' : 'bg-white'
                }`}>
                <CardContent className="p-8">
                    <p className="text-center text-gray-500 mb-8 text-lg italic">
                        "{currentSentence.translation[language]}"
                    </p>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(i => i.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex flex-wrap justify-center gap-3 min-h-[80px]">
                                {items.map((item) => (
                                    <SortableWord key={item.id} id={item.id} word={item.word} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="mt-8 flex justify-center gap-4">
                        {isCorrect === null && (
                            <Button
                                onClick={checkAnswer}
                                className="bg-blue-600 hover:bg-blue-700 px-8"
                            >
                                {language === 'kz' ? 'Тексеру' : 'Проверить'}
                            </Button>
                        )}

                        {isCorrect === false && (
                            <Button
                                onClick={() => loadSentence(currentSentenceIndex)}
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <RefreshCw className="size-4 mr-2" />
                                {language === 'kz' ? 'Қайталау' : 'Повторить'}
                            </Button>
                        )}

                        {isCorrect === true && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex gap-4"
                            >
                                <div className="flex items-center text-green-600 font-bold mr-4">
                                    <Check className="size-6 mr-2" />
                                    {language === 'kz' ? 'Дұрыс!' : 'Правильно!'}
                                </div>
                                <Button
                                    onClick={nextSentence}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {language === 'kz' ? 'Келесі' : 'Следующий'}
                                    <ArrowRight className="size-4 ml-2" />
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
