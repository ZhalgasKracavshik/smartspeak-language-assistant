/**
 * Cloudinary Service
 * Handles media upload, optimization, and URL generation
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (server-side only)
if (process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export interface UploadResult {
    public_id: string;
    secure_url: string;
    duration?: number;
    format: string;
    resource_type: string;
}

/**
 * Upload video to Cloudinary
 */
export async function uploadVideo(
    filePath: string,
    folder: string = 'smartspeak/videos'
): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video',
            folder: folder,
            chunk_size: 6000000, // 6MB chunks for large files
            eager: [
                { width: 640, height: 360, crop: 'limit', format: 'mp4' }, // SD quality
                { width: 1280, height: 720, crop: 'limit', format: 'mp4' }, // HD quality
            ],
            eager_async: true,
        });

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            duration: result.duration,
            format: result.format,
            resource_type: result.resource_type,
        };
    } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        throw new Error('Failed to upload video');
    }
}

/**
 * Upload audio to Cloudinary
 */
export async function uploadAudio(
    filePath: string,
    folder: string = 'smartspeak/audio'
): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video', // Cloudinary treats audio as video
            folder: folder,
        });

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            duration: result.duration,
            format: result.format,
            resource_type: result.resource_type,
        };
    } catch (error) {
        console.error('Error uploading audio to Cloudinary:', error);
        throw new Error('Failed to upload audio');
    }
}

/**
 * Generate thumbnail from video
 */
export async function generateThumbnail(publicId: string): Promise<string> {
    return cloudinary.url(publicId, {
        resource_type: 'video',
        transformation: [
            { width: 400, height: 225, crop: 'fill', gravity: 'center' },
            { quality: 'auto', fetch_format: 'auto' },
        ],
        format: 'jpg',
    });
}

/**
 * Get optimized video URL
 */
export function getOptimizedVideoUrl(
    publicId: string,
    quality: 'sd' | 'hd' = 'sd'
): string {
    const width = quality === 'hd' ? 1280 : 640;
    const height = quality === 'hd' ? 720 : 360;

    return cloudinary.url(publicId, {
        resource_type: 'video',
        transformation: [
            { width, height, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
        ],
    });
}

/**
 * Delete media from Cloudinary
 */
export async function deleteMedia(publicId: string, resourceType: 'video' | 'image' = 'video'): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error);
        throw new Error('Failed to delete media');
    }
}

/**
 * Client-side: Get Cloudinary URL for CldVideoPlayer
 */
export function getCloudinaryConfig() {
    return {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    };
}
