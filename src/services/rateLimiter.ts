
// Rate Limiter Service
// Implements a simple token bucket or window-based rate limiting for client-side actions.
// Note: Client-side rate limiting is easily bypassed by determined attackers, but helps prevent accidental spam and basic bot scripts.
// For robust protection, this should be paired with server-side rate limiting (e.g., Supabase Edge Functions or Middleware).

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const LIMITS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 mins
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  chat: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 messages per minute
  friendRequest: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 requests per hour
};

interface RateLimitEntry {
  count: number;
  startTime: number;
}

class RateLimiter {
  private storageKey = 'smartspeak_rate_limit';
  private limits: Record<string, RateLimitEntry> = {};

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.limits = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse rate limit data', e);
        this.limits = {};
      }
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.limits));
  }

  check(action: string): { allowed: boolean; waitTime?: number } {
    const config = LIMITS[action];
    if (!config) return { allowed: true }; // No limit defined

    const now = Date.now();
    const entry = this.limits[action] || { count: 0, startTime: now };

    // Reset if window passed
    if (now - entry.startTime > config.windowMs) {
      entry.count = 0;
      entry.startTime = now;
    }

    if (entry.count >= config.maxRequests) {
      const waitTime = Math.ceil((entry.startTime + config.windowMs - now) / 1000);
      return { allowed: false, waitTime };
    }

    return { allowed: true };
  }

  increment(action: string) {
    const config = LIMITS[action];
    if (!config) return;

    const now = Date.now();
    let entry = this.limits[action];

    if (!entry || now - entry.startTime > config.windowMs) {
      entry = { count: 1, startTime: now };
    } else {
      entry.count++;
    }

    this.limits[action] = entry;
    this.save();
  }
}

export const rateLimiter = new RateLimiter();
