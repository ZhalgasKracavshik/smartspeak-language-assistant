import { Word } from '../data/vocabulary';

export interface WordProgress {
    wordId: string;
    status: 'new' | 'learning' | 'mastered';
    nextReview: number; // Timestamp
    interval: number; // Days
    easeFactor: number;
    repetitions: number;
}

const STORAGE_KEY = 'smartspeak_vocabulary_progress';

export const SpacedRepetitionService = {
    // SM-2 Algorithm Implementation
    calculateNextReview: (progress: WordProgress, quality: number): WordProgress => {
        let { interval, easeFactor, repetitions } = progress;

        // Quality: 0-5 (0=blackout, 5=perfect)
        // If quality < 3, start over
        if (quality < 3) {
            repetitions = 0;
            interval = 1;
        } else {
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        }

        // Update Ease Factor
        // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

        return {
            ...progress,
            status: repetitions > 5 ? 'mastered' : 'learning',
            nextReview,
            interval,
            easeFactor,
            repetitions
        };
    },

    // Get progress for a specific word
    getProgress: (wordId: string): WordProgress => {
        const allProgress = SpacedRepetitionService.getAllProgress();
        return allProgress[wordId] || {
            wordId,
            status: 'new',
            nextReview: Date.now(),
            interval: 0,
            easeFactor: 2.5,
            repetitions: 0
        };
    },

    // Get all progress from local storage
    getAllProgress: (): Record<string, WordProgress> => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error reading progress:', e);
            return {};
        }
    },

    // Save progress for a word
    saveProgress: (progress: WordProgress) => {
        const allProgress = SpacedRepetitionService.getAllProgress();
        allProgress[progress.wordId] = progress;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    },

    // Get words due for review
    getDueWords: (allWords: Word[]): Word[] => {
        const allProgress = SpacedRepetitionService.getAllProgress();
        const now = Date.now();

        return allWords.filter(word => {
            const progress = allProgress[word.id];
            // If no progress, it's not "due" in SRS sense unless we auto-add new words.
            // For now, only review words that have been started (status != new) OR are explicitly saved/started.
            // Let's say "Due" means: has progress AND nextReview <= now.
            if (!progress) return false;
            return progress.nextReview <= now;
        });
    },

    // Initialize progress for a new word (e.g. when user saves it)
    initializeWord: (wordId: string) => {
        const current = SpacedRepetitionService.getProgress(wordId);
        if (current.status === 'new' && current.repetitions === 0) {
            // Only init if really new
            SpacedRepetitionService.saveProgress({
                ...current,
                status: 'learning',
                nextReview: Date.now(), // Due immediately
            });
        }
    },

    updateProgress: (wordId: string, isCorrect: boolean) => {
        const current = SpacedRepetitionService.getProgress(wordId);
        // Quality: 5 for correct, 1 for incorrect (simplified)
        const quality = isCorrect ? 5 : 1;
        const updated = SpacedRepetitionService.calculateNextReview(current, quality);
        SpacedRepetitionService.saveProgress(updated);
    }
};
