'use server';

import { supabase } from '../lib/supabase';
import { headers } from 'next/headers';

export interface SecurityLogEntry {
    ip_address?: string; // Optional now, auto-detected
    user_id?: string;
    action: 'login' | 'signup' | 'ai_request' | 'page_view' | 'logout' | 'failed_login';
    endpoint?: string;
    user_agent?: string;
    is_guest?: boolean;
    metadata?: Record<string, any>;
}

/**
 * Log security events to Supabase
 * Automatically captures IP from request headers
 */
export async function logSecurityEvent(entry: SecurityLogEntry) {
    try {
        let realIp = 'unknown';
        let userAgent = 'unknown';

        try {
            const headersList = await headers();
            const forwardedFor = headersList.get('x-forwarded-for');
            realIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
            userAgent = headersList.get('user-agent') || 'unknown';
        } catch (e) {
            // Fallback if headers() fails (e.g. not in a request context)
            console.warn('Could not access headers for security logging');
        }

        // Allow manual override if provided in entry (useful for client-side passed IPs if trusted, though risky)
        // For now, we prioritize the server-detected IP for security, unless it's unknown
        if (realIp === 'unknown' && entry.ip_address) {
            realIp = entry.ip_address;
        }

        const { error } = await supabase
            .from('security_logs')
            .insert({
                ip_address: realIp,
                user_id: entry.user_id || null,
                action: entry.action,
                endpoint: entry.endpoint || null,
                user_agent: userAgent,
                is_guest: entry.is_guest || false,
                metadata: entry.metadata || {}
            });

        if (error) {
            console.error('Failed to log security event:', error);
        }
    } catch (err) {
        console.error('Security logging error:', err);
    }
}

/**
 * Get suspicious activity report (admin only)
 */
export async function getSuspiciousActivity() {
    try {
        const { data, error } = await supabase
            .from('suspicious_activity')
            .select('*')
            .limit(50);

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Failed to fetch suspicious activity:', err);
        return [];
    }
}

/**
 * Get logs for a specific IP address
 */
export async function getLogsByIP(ip: string, limit = 100) {
    try {
        const { data, error } = await supabase
            .from('security_logs')
            .select('*')
            .eq('ip_address', ip)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Failed to fetch logs by IP:', err);
        return [];
    }
}
