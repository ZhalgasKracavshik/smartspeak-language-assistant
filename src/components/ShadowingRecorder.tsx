'use client';

import React, { useState, useRef, useEffect } from 'react';
import '../components/Improvements.css';

interface ShadowingRecorderProps {
    originalAudioUrl?: string; // Optional: for future comparison features
}

export function ShadowingRecorder({ originalAudioUrl }: ShadowingRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please allow permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
    };

    return (
        <div className="shadowing-recorder">
            <div className="shadowing-recorder__header">
                <h3>🎤 Shadowing Mode</h3>
                <p>Record your voice to practice pronunciation</p>
            </div>

            <div className="shadowing-recorder__controls">
                {!isRecording && !audioUrl && (
                    <button onClick={startRecording} className="btn-record">
                        <span className="record-icon">●</span> Start Recording
                    </button>
                )}

                {isRecording && (
                    <button onClick={stopRecording} className="btn-stop">
                        <span className="stop-icon">■</span> Stop Recording
                    </button>
                )}

                {audioUrl && (
                    <div className="recording-playback">
                        <audio src={audioUrl} controls className="audio-player" />
                        <div className="playback-actions">
                            <button onClick={deleteRecording} className="btn-delete">
                                🗑️ Discard
                            </button>
                            <a
                                href={audioUrl}
                                download="shadowing-practice.webm"
                                className="btn-download"
                            >
                                💾 Save
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {isRecording && (
                <div className="recording-visualizer">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="recording-status">Recording...</div>
                </div>
            )}
        </div>
    );
}
