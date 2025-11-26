'use client';

import React, { useState } from 'react';
import { MEDICAL_TERMS, MedicalTerm } from '@/data/medical_terms';
import '@/styles/medical.css';

export default function MedicalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [showLatin, setShowLatin] = useState(false);

    const categories = ['All', ...Array.from(new Set(MEDICAL_TERMS.map(t => t.category)))];

    const filteredTerms = MEDICAL_TERMS.filter(term => {
        const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            term.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="medical-page">
            <div className="medical-hero">
                <div className="medical-hero__content">
                    <h1>🩺 Medical & Biological Mastery</h1>
                    <p>Essential terminology for future international doctors.</p>
                </div>
            </div>

            <div className="medical-controls">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search terms (e.g., 'Cardiology', 'Cell')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="toggle-wrapper">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={showLatin}
                            onChange={(e) => setShowLatin(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="toggle-label">Show Latin Terms 🏛️</span>
                </div>
            </div>

            <div className="terms-grid">
                {filteredTerms.map(term => (
                    <div key={term.id} className="term-card">
                        <div className="term-card__header">
                            <span className={`category-badge ${term.category.toLowerCase()}`}>
                                {term.category}
                            </span>
                            {showLatin && term.latin && (
                                <span className="latin-term">{term.latin}</span>
                            )}
                        </div>

                        <h2 className="term-title">{term.term}</h2>
                        <p className="term-definition">{term.definition}</p>

                        <div className="term-example">
                            <strong>Example:</strong>
                            <p>"{term.example}"</p>
                        </div>

                        <button className="btn-pronounce" onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(term.term);
                            utterance.lang = 'en-US';
                            window.speechSynthesis.speak(utterance);
                        }}>
                            🔊 Listen
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
