'use client';

import React from 'react';
import { VideoWithSubtitles } from '@/components/VideoWithSubtitles';

export default function VideoTestPage() {
    const testVideoUrl = 'https://res.cloudinary.com/dvn30df1m/video/upload/v1764189249/owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc.mp4';

    return (
        <div style={{
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    🎬 Видео с AI-Субтитрами
                </h1>
                <p style={{
                    color: '#64748b',
                    fontSize: '16px',
                    marginBottom: '32px'
                }}>
                    Нажмите "Сгенерировать субтитры" для автоматической транскрипции видео с помощью Gemini AI
                </p>

                <VideoWithSubtitles
                    videoUrl={testVideoUrl}
                    autoGenerateSubtitles={false}
                />

                <div style={{
                    marginTop: '32px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#0369a1'
                    }}>
                        📋 Инструкция:
                    </h3>
                    <ol style={{
                        paddingLeft: '20px',
                        color: '#475569',
                        lineHeight: '1.8'
                    }}>
                        <li>Нажмите кнопку "Сгенерировать субтитры"</li>
                        <li>Подождите пока Gemini AI обработает видео (~10-30 секунд)</li>
                        <li>Запустите видео - субтитры появятся автоматически</li>
                        <li>Используйте кнопку "Скрыть/Показать" для управления субтитрами</li>
                    </ol>
                </div>

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fef2f2',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    fontSize: '14px',
                    color: '#991b1b'
                }}>
                    <strong>💡 Бесплатный tier:</strong> Используется Gemini 2.0 Flash (бесплатная версия).
                    Лимит: 1500 запросов в день, этого достаточно для сотен видео!
                </div>
            </div>
        </div>
    );
}
