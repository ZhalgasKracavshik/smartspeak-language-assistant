import { NextRequest, NextResponse } from 'next/server';
import { uploadBuffer } from '@/services/cloudinary';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as 'video' | 'audio' || 'video';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
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
