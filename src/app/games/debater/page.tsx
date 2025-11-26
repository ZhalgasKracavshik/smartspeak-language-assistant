'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/styles/games.css';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    score?: number;
}

const TOPICS = [
    "Pineapple belongs on pizza",
    "AI will eventually replace all human jobs",
    "Social media does more harm than good",
    "Cats are better pets than dogs",
    "Video games should be an Olympic sport",
    "Space exploration is a waste of money",
    "Summer is objectively better than Winter",
    "Books are always better than their movie adaptations",
    "Remote work is more productive than office work",
    "Cryptocurrency is the future of money",
    "School uniforms should be mandatory",
    "Fast food should be banned"
];

let lastUsedTopic = '';

function getRandomTopic(): string {
    let availableTopics = TOPICS.filter(t => t !== lastUsedTopic);
    if (availableTopics.length === 0) availableTopics = TOPICS;
    const selected = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    lastUsedTopic = selected;
    return selected;
}

export default function DebaterPage() {
    const [topic, setTopic] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const newTopic = () => {
        const randomTopic = getRandomTopic();
        setTopic(randomTopic);
        setMessages([
            {
                id: 'init',
                role: 'ai',
                content: `I strongly disagree that "${randomTopic}". Prove me wrong!`
            }
        ]);
    };

    useEffect(() => {
        newTopic();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/debate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    history: [...messages, userMsg],
                    userArgument: input
                }),
            });

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.reply,
                score: data.score
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error('Debate error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="debater-page">
            <div className="debater-container">
                <div className="debater-header">
                    <h1>⚖️ The Debater</h1>
                    <div className="topic-card">
                        <span className="topic-label">Current Topic</span>
                        <div className="topic-text">"{topic}"</div>
                        <button onClick={newTopic} className="btn-new-topic">
                            🔄 New Topic
                        </button>
                    </div>
                </div>

                <div className="debater-chat">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`debate-message ${msg.role}`}>
                            <div className="debate-avatar">
                                {msg.role === 'ai' ? '🤖' : '🧑‍⚖️'}
                            </div>
                            <div className="debate-bubble">
                                {msg.content}
                                {msg.score && (
                                    <div className="score-indicator">
                                        Argument Score: {msg.score}/10
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="debate-message ai">
                            <div className="debate-avatar">🤖</div>
                            <div className="debate-bubble">Analyzing your logic...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="debate-input-area">
                    <div className="debate-controls">
                        <textarea
                            className="debate-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Construct your argument..."
                            disabled={loading}
                        />
                        <button
                            className="btn-debate-send"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                        >
                            Argue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
