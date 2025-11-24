const STORAGE_KEY = 'smartspeak_time_tracking';

export interface DailyUsage {
    date: string; // YYYY-MM-DD
    minutes: number;
}

class TimeTrackingService {
    private startTime: number | null = null;
    private timerId: number | null = null;

    constructor() {
        // Try to restore state if page was refreshed
        if (typeof window !== 'undefined') {
            const savedStart = sessionStorage.getItem('session_start_time');
            if (savedStart) {
                this.startTime = parseInt(savedStart, 10);
                this.startTracking();
            }
        }
    }

    startTracking() {
        if (typeof window === 'undefined') return;
        if (this.timerId) return; // Already tracking

        if (!this.startTime) {
            this.startTime = Date.now();
            sessionStorage.setItem('session_start_time', this.startTime.toString());
        }

        // Save progress every minute
        this.timerId = window.setInterval(() => {
            this.saveSession();
        }, 60000);
    }

    stopTracking() {
        if (typeof window === 'undefined') return;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.saveSession();
        this.startTime = null;
        sessionStorage.removeItem('session_start_time');
    }

    private saveSession() {
        if (typeof window === 'undefined') return;
        if (!this.startTime) return;

        const now = Date.now();
        const durationMs = now - this.startTime;
        const durationMinutes = Math.floor(durationMs / 60000);

        if (durationMinutes > 0) {
            this.addMinutesToToday(durationMinutes);
            // Reset start time to now to avoid double counting
            this.startTime = now;
            sessionStorage.setItem('session_start_time', this.startTime.toString());
        }
    }

    private addMinutesToToday(minutes: number) {
        if (typeof window === 'undefined') return;

        const today = new Date().toISOString().split('T')[0];
        const history = this.getHistory();

        const todayEntryIndex = history.findIndex(h => h.date === today);

        if (todayEntryIndex >= 0) {
            history[todayEntryIndex].minutes += minutes;
        } else {
            history.push({ date: today, minutes });
        }

        // Keep only last 30 days
        if (history.length > 30) {
            history.shift();
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    getHistory(): DailyUsage[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    getTodayMinutes(): number {
        const today = new Date().toISOString().split('T')[0];
        const history = this.getHistory();
        const entry = history.find(h => h.date === today);
        return entry ? entry.minutes : 0;
    }

    getLast7Days(): DailyUsage[] {
        const history = this.getHistory();
        const last7 = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const entry = history.find(h => h.date === dateStr);
            last7.push(entry || { date: dateStr, minutes: 0 });
        }

        return last7;
    }
}

export const timeTrackingService = new TimeTrackingService();
