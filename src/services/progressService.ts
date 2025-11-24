// Progress tracking service
export interface UserProgress {
    learnedWords: number;
    completedLessons: number;
    points: number;
    achievements: number;
    streak: number;
    lastVisit: string;
    todayGoalProgress: number;
    vocabularyProgress: Record<string, boolean>; // word id -> learned
    lessonsCompleted: string[]; // lesson ids
}

const DEFAULT_PROGRESS: UserProgress = {
    learnedWords: 0,
    completedLessons: 0,
    points: 0,
    achievements: 0,
    streak: 0,
    lastVisit: new Date().toISOString(),
    todayGoalProgress: 0,
    vocabularyProgress: {},
    lessonsCompleted: [],
};

const STORAGE_KEY = 'smartspeak-progress';

export function getProgress(): UserProgress {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const progress = JSON.parse(stored);
            // Update streak
            return updateStreak(progress);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
    return DEFAULT_PROGRESS;
}

export function saveProgress(progress: UserProgress): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

function updateStreak(progress: UserProgress): UserProgress {
    const lastVisit = new Date(progress.lastVisit);
    const today = new Date();

    // Reset time to start of day for comparison
    lastVisit.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
        // Same day, keep streak
        return progress;
    } else if (daysDiff === 1) {
        // Next day, increment streak
        return {
            ...progress,
            streak: progress.streak + 1,
            lastVisit: new Date().toISOString(),
            todayGoalProgress: 0, // Reset daily goal
        };
    } else {
        // Missed days, reset streak
        return {
            ...progress,
            streak: 1,
            lastVisit: new Date().toISOString(),
            todayGoalProgress: 0,
        };
    }
}

export function markWordAsLearned(wordId: string): UserProgress {
    const progress = getProgress();

    if (!progress.vocabularyProgress[wordId]) {
        progress.vocabularyProgress[wordId] = true;
        progress.learnedWords += 1;
        progress.points += 10;
        progress.todayGoalProgress = Math.min(100, progress.todayGoalProgress + 5);
        saveProgress(progress);
    }

    return progress;
}

export function markLessonAsCompleted(lessonId: string): UserProgress {
    const progress = getProgress();

    if (!progress.lessonsCompleted.includes(lessonId)) {
        progress.lessonsCompleted.push(lessonId);
        progress.completedLessons += 1;
        progress.points += 50;
        progress.todayGoalProgress = Math.min(100, progress.todayGoalProgress + 25);
        saveProgress(progress);
    }

    return progress;
}

export function addPoints(points: number): UserProgress {
    const progress = getProgress();
    progress.points += points;
    saveProgress(progress);
    return progress;
}

export function resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
}
