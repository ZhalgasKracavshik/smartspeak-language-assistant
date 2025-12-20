'use client';

import React, { useState } from 'react';
import { MEDICAL_TERMS, MedicalTerm } from '@/data/medical_terms';
import { Search, Stethoscope, BookOpen, Volume2, ToggleLeft, ToggleRight } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-12 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                            <Stethoscope className="size-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Medical & Biological Mastery</h1>
                    </div>
                    <p className="text-teal-100 text-lg max-w-2xl">
                        Essential terminology for future international doctors. Master the language of medicine.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Controls Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                            <input
                                type="text"
                                placeholder="Search terms (e.g., 'Cardiology', 'Cell')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Latin Toggle */}
                        <div
                            className="flex items-center gap-3 cursor-pointer select-none bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowLatin(!showLatin)}
                        >
                            {showLatin ? (
                                <ToggleRight className="size-8 text-teal-600" />
                            ) : (
                                <ToggleLeft className="size-8 text-gray-400" />
                            )}
                            <span className="font-medium text-gray-700">Show Latin Terms 🏛️</span>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-teal-600 text-white shadow-md scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTerms.map(term => (
                        <div key={term.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${term.category === 'Anatomy' ? 'bg-blue-100 text-blue-700' :
                                            term.category === 'Diseases' ? 'bg-red-100 text-red-700' :
                                                'bg-teal-100 text-teal-700'
                                        }`}>
                                        {term.category}
                                    </span>
                                    {showLatin && term.latin && (
                                        <span className="text-xs font-serif italic text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                            {term.latin}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    {term.term}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {term.definition}
                                </p>

                                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                                    <strong className="text-xs text-gray-500 uppercase block mb-1">Example:</strong>
                                    <p className="text-sm text-gray-700 italic">"{term.example}"</p>
                                </div>

                                <button
                                    className="w-full flex items-center justify-center gap-2 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
                                    onClick={() => {
                                        const utterance = new SpeechSynthesisUtterance(term.term);
                                        utterance.lang = 'en-US';
                                        window.speechSynthesis.speak(utterance);
                                    }}
                                >
                                    <Volume2 className="size-4" />
                                    Listen
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTerms.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
                            <BookOpen className="size-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No terms found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
