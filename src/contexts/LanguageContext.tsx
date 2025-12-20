'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, getCurrentLanguage, setCurrentLanguage, Translations } from '../utils/i18n';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Always default to 'ru' (or safe default) during SSR to prevent mismatch
    const [language, setLanguageState] = useState<Language>('ru');
    const [t, setT] = useState<Translations>(getTranslations('ru'));

    useEffect(() => {
        // Hydrate from localStorage on mount
        const currentData = getCurrentLanguage();
        if (currentData !== 'ru') {
            setLanguageState(currentData);
            setT(getTranslations(currentData));
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setCurrentLanguage(lang);
        setT(getTranslations(lang));
    };

    useEffect(() => {
        setT(getTranslations(language));
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
