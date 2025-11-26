'use client';

import React, { useState } from 'react';
import { MEDICAL_TERMS } from '@/data/medical_terms';
import '@/styles/medical.css';

export default function TermsPage() {
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

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="medical-page">
            <div className="medical-hero">
                <div className="medical-hero__content">
                    <h1>📚 Medical & Biological Terms</h1>
                    <p>Essential terminology for future international doctors and scientists.</p>
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
                {filteredTerms.length > 0 ? (
                    filteredTerms.map(term => (
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

                            <button className="btn-pronounce" onClick={() => speak(term.term)}>
                                🔊 Listen
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No terms found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
