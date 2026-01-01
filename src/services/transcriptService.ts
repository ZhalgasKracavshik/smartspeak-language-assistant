// For AI-generated transcripts, use aiTranscription.ts instead
import { MediaType } from '../types/media';


export interface TranscriptSegment {
    text: string;
    startTime: number;
    endTime: number;
}

interface TranscriptCache {
    [videoId: string]: {
        segments: TranscriptSegment[];
        timestamp: number;
    };
}

const CACHE_KEY = 'smartspeak_transcript_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCachedTranscript(videoId: string): TranscriptSegment[] | null {
    try {
        const cache: TranscriptCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const cached = cache[videoId];
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.segments;
        }
    } catch (error) {
        console.error('Error reading transcript cache:', error);
    }
    return null;
}

function saveToCache(videoId: string, segments: TranscriptSegment[]): void {
    try {
        const cache: TranscriptCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        cache[videoId] = { segments, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error saving transcript cache:', error);
    }
}

async function fetchYouTubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
    try {
        const response = await fetch(`https://youtube-transcript-api.vercel.app/api/transcript?videoId=${videoId}`);
        if (!response.ok) throw new Error('YouTube transcript not available');

        const data = await response.json();
        if (!data.transcript || data.transcript.length === 0) throw new Error('No transcript found');

        return data.transcript.map((item: any) => ({
            text: item.text,
            startTime: item.offset / 1000,
            endTime: (item.offset + item.duration) / 1000
        }));
    } catch (error) {
        console.error('YouTube transcript fetch failed:', error);
        throw error;
    }
}

export async function fetchTranscript(
    videoId: string,
    title: string,
    type: MediaType
): Promise<TranscriptSegment[]> {
    const cached = getCachedTranscript(videoId);
    if (cached) {
        return cached;
    }

    try {
        const segments = await fetchYouTubeTranscript(videoId);
        saveToCache(videoId, segments);
        return segments;
    } catch (youtubeError) {
        return [{
            text: type === 'song'
                ? 'Lyrics not available. YouTube captions may be disabled for this video.'
                : 'Transcript not available. YouTube captions may be disabled for this video.',
            startTime: 0,
            endTime: 10
        }];
    }
}

export function findActiveSegment(segments: TranscriptSegment[], currentTime: number): number {
    for (let i = 0; i < segments.length; i++) {
        if (currentTime >= segments[i].startTime && currentTime < segments[i].endTime) {
            return i;
        }
    }
    if (currentTime < segments[0].startTime) return 0;
    return segments.length - 1;
}
