/**
 * Client-side Upload Service
 * Handles uploading files via the API route
 */

import { supabase } from '@/lib/supabase';

export interface UploadResult {
    public_id: string;
    secure_url: string;
    duration?: number;
    format: string;
    resource_type: string;
    thumbnail_url: string;
}

export async function uploadToCloudinary(
    file: File,
    type: 'video' | 'audio'
): Promise<UploadResult> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
    }

    return await response.json();
}
