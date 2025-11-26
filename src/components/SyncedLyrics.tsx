'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Subtitle, Word } from '@/types/media';
import { motion, AnimatePresence } from 'framer-motion';
import '../components/Improvements.css';

interface SyncedLyricsProps {
    subtitles: Subtitle[];
    currentTime: number;
    onSeek?: (time: number) => void;
}

export function SyncedLyrics({ subtitles, currentTime, onSeek }: SyncedLyricsProps) {
    const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(-1);
    const [activeWordIndex, setActiveWordIndex] = useState(-1);
    const [hoveredWord, setHoveredWord] = useState<{ word: string; translation?: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);

    // Find active subtitle and word based on current time
    useEffect(() => {
        let foundIndex = -1;
        let foundWordIndex = -1;

        for (let i = 0; i < subtitles.length; i++) {
            const subtitle = subtitles[i];

            if (currentTime >= subtitle.start_time && currentTime <= subtitle.end_time) {
                foundIndex = i;

                // Find active word within this subtitle
                if (subtitle.words && subtitle.words.length > 0) {
                    for (let j = 0; j < subtitle.words.length; j++) {
                        const word = subtitle.words[j];
                        if (currentTime >= word.start && currentTime <= word.end) {
                            foundWordIndex = j;
                            break;
                        }
                    }
                }
                break;
            }
        }

        setActiveSubtitleIndex(foundIndex);
        setActiveWordIndex(foundWordIndex);
    }, [currentTime, subtitles]);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineRef.current && containerRef.current) {
            activeLineRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeSubtitleIndex]);

    const handleLineClick = (startTime: number) => {
        if (onSeek) {
            onSeek(startTime);
        }
    };

    if (subtitles.length === 0) {
        return (
            <div className="synced-lyrics synced-lyrics--empty">
                <p>No lyrics available for this content.</p>
            </div>
        );
    }

    return (
        <div className="synced-lyrics" ref={containerRef}>
            <AnimatePresence>
                {subtitles.map((subtitle, index) => {
                    const isActive = index === activeSubtitleIndex;

                    return (
                        <motion.div
                            key={subtitle.id}
                            ref={isActive ? activeLineRef : null}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => handleLineClick(subtitle.start_time)}
                            className={`synced-lyrics__line ${isActive ? 'synced-lyrics__line--active' : ''}`}
                        >
                            {/* English text with word highlighting */}
                            <div className="synced-lyrics__text-en">
                                {subtitle.words && subtitle.words.length > 0 ? (
                                    subtitle.words.map((word, wordIndex) => (
                                        <span
                                            key={wordIndex}
                                            className={`synced-lyrics__word word-tooltip ${isActive && wordIndex === activeWordIndex
                                                    ? 'synced-lyrics__word--active'
                                                    : ''
                                                }`}
                                            onMouseEnter={() => setHoveredWord(word.translation ? { word: word.word, translation: word.translation } : null)}
                                            onMouseLeave={() => setHoveredWord(null)}
                                            style={{
                                                color: isActive && wordIndex === activeWordIndex ? '#FFD700' : isActive ? '#FFFFFF' : '#9CA3AF',
                                                transform: isActive && wordIndex === activeWordIndex ? 'scale(1.1)' : 'scale(1)',
                                                transition: 'all 0.2s ease',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {word.word}{' '}
                                            {hoveredWord?.word === word.word && hoveredWord.translation && (
                                                <span className="word-tooltip__content">
                                                    {hoveredWord.translation}
                                                </span>
                                            )}
                                        </span>
                                    ))
                                ) : (
                                    <span>{subtitle.text_en}</span>
                                )}
                            </div>

                            {/* Russian translation */}
                            {subtitle.text_ru && (
                                <div className="synced-lyrics__text-ru">
                                    {subtitle.text_ru}
                                </div>
                            )}

                            {/* Timestamp (optional) */}
                            <div className="synced-lyrics__timestamp">
                                {formatTime(subtitle.start_time)}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
