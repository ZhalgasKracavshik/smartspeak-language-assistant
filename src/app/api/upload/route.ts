import { NextRequest, NextResponse } from 'next/server';
import { uploadBuffer } from '@/services/cloudinary';
import { requireAuth } from '@/middleware/auth';

export async function POST(req: NextRequest) {
    try {
        // SECURITY: Require authentication
        const authResult = await requireAuth(req);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { user } = authResult;

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as 'video' | 'audio' || 'video';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // SECURITY: File validation
        const MAX_SIZE = 100 * 1024 * 1024; // 100MB
        const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
        const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
        const ALLOWED_TYPES = [...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES];

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 100MB' },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result = await uploadBuffer(
            buffer,
            type,
            `smartspeak/${type}s`
        );

        return NextResponse.json(result);

    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
