import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';

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

interface SentenceBuilderProps {
    sentence: string;
    translation: string;
    onComplete: (success: boolean) => void;
}

export function SentenceBuilder({ sentence, translation, onComplete }: SentenceBuilderProps) {
    const { language } = useLanguage();
    const [items, setItems] = useState<{ id: string, word: string }[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (sentence) {
            loadSentence();
        }
    }, [sentence]);

    const loadSentence = () => {
        if (!sentence) return;
        const words = sentence.split(' ');
        const shuffled = words.map((word, idx) => ({
            id: `${word}-${idx}-${Math.random()}`,
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
        const userSentence = items.map(i => i.word).join(' ');

        // Simple normalization: remove extra spaces, case insensitive?
        // Let's stick to exact match for now as it's a builder
        if (userSentence === sentence) {
            setIsCorrect(true);
            setTimeout(() => {
                onComplete(true);
            }, 1500);
        } else {
            setIsCorrect(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                    <Trophy className="size-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'kz' ? 'Сөйлем құрастырыңыз' : 'Составьте предложение'}
                </h2>
            </motion.div>

            <Card className={`border-0 shadow-xl transition-colors duration-500 ${isCorrect === true ? 'bg-green-50' :
                isCorrect === false ? 'bg-red-50' : 'bg-white'
                }`}>
                <CardContent className="p-8">
                    <p className="text-center text-gray-500 mb-8 text-lg italic">
                        "{translation}"
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
                                onClick={loadSentence}
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
                                className="flex items-center text-green-600 font-bold"
                            >
                                <Check className="size-6 mr-2" />
                                {language === 'kz' ? 'Дұрыс!' : 'Правильно!'}
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
