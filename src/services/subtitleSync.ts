/**
 * Subtitle synchronization utilities
 * Helpers for working with timecoded subtitles
 */

import { Subtitle, Word } from '@/types/media';

/**
 * Parse SRT format subtitles to our Subtitle format
 * SRT format example:
 * 1
 * 00:00:12,000 --> 00:00:15,500
 * Hello world
 */
export function parseSRT(srtContent: string): Subtitle[] {
    const subtitles: Subtitle[] = [];
    const blocks = srtContent.trim().split('\n\n');

    blocks.forEach((block) => {
        const lines = block.split('\n');
        if (lines.length < 3) return;

        const timeLine = lines[1];
        const textLines = lines.slice(2);

        const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);

        if (timeMatch) {
            const startTime = parseTimestamp(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
            const endTime = parseTimestamp(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);

            subtitles.push({
                id: crypto.randomUUID(),
                media_id: '',
                start_time: startTime,
                end_time: endTime,
                text_en: textLines.join(' '),
                text_ru: '',
                words: [],
            });
        }
    });

    return subtitles;
}

/**
 * Convert time components to seconds
 */
function parseTimestamp(hours: string, minutes: string, seconds: string, milliseconds: string): number {
    return (
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds) +
        parseInt(milliseconds) / 1000
    );
}

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to SRT timestamp format (HH:MM:SS,mmm)
 */
export function formatSRTTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds
            .toString()
            .padStart(3, '0')}`;
}

/**
 * Get the active subtitle for a given time
 */
export function getActiveSubtitle(subtitles: Subtitle[], currentTime: number): Subtitle | null {
    for (const subtitle of subtitles) {
        if (currentTime >= subtitle.start_time && currentTime <= subtitle.end_time) {
            return subtitle;
        }
    }
    return null;
}

/**
 * Get the active word within a subtitle
 */
export function getActiveWord(subtitle: Subtitle, currentTime: number): Word | null {
    if (!subtitle.words || subtitle.words.length === 0) {
        return null;
    }

    for (const word of subtitle.words) {
        if (currentTime >= word.start && currentTime <= word.end) {
            return word;
        }
    }
    return null;
}

/**
 * Split subtitle text into words with estimated timing
 * This is a fallback when word-level timing is not available
 */
export function estimateWordTimings(subtitle: Subtitle): Word[] {
    const words = subtitle.text_en.split(' ').filter(w => w.length > 0);
    const duration = subtitle.end_time - subtitle.start_time;
    const timePerWord = duration / words.length;

    return words.map((word, index) => ({
        word,
        start: subtitle.start_time + (index * timePerWord),
        end: subtitle.start_time + ((index + 1) * timePerWord),
    }));
}
