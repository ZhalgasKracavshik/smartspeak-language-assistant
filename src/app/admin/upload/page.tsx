'use client';

import React, { useState } from 'react';
import { uploadToCloudinary } from '@/services/cloudinary';
import '../styles/admin.css';

interface MediaForm {
    title: string;
    description: string;
    type: 'video' | 'audio';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    tags: string;
    file: File | null;
    subtitleFile: File | null;
    useAI: boolean;
}

export default function AdminUploadPage() {
    const [forms, setForms] = useState<MediaForm[]>([createEmptyForm()]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<string[]>([]);

    function createEmptyForm(): MediaForm {
        return {
            title: '',
            description: '',
            type: 'video',
            difficulty: 'intermediate',
            category: 'music',
            tags: '',
            file: null,
            subtitleFile: null,
            useAI: true,
        };
    }

    const addForm = () => {
        setForms([...forms, createEmptyForm()]);
    };

    const removeForm = (index: number) => {
        setForms(forms.filter((_, i) => i !== index));
    };

    const updateForm = (index: number, field: keyof MediaForm, value: any) => {
        const newForms = [...forms];
        newForms[index] = { ...newForms[index], [field]: value };
        setForms(newForms);
    };

    const handleBulkUpload = async () => {
        setUploading(true);
        setProgress([]);

        for (let i = 0; i < forms.length; i++) {
            const form = forms[i];

            try {
                setProgress(prev => [...prev, `📤 [${i + 1}/${forms.length}] Uploading ${form.title}...`]);

                if (!form.file) {
                    setProgress(prev => [...prev, `❌ [${i + 1}] No file selected for ${form.title}`]);
                    continue;
                }

                // 1. Upload to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(form.file, form.type);

                setProgress(prev => [...prev, `✅ [${i + 1}] Uploaded to Cloudinary: ${form.title}`]);

                // 2. Handle Subtitles (AI or File)
                let subtitles: any[] = [];

                if (form.useAI && !form.subtitleFile) {
                    // Use AI transcription
                    setProgress(prev => [...prev, `🤖 [${i + 1}] Generating AI subtitles...`]);

                    try {
                        const transcribeResponse = await fetch('/api/transcribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                mediaUrl: cloudinaryResult.secure_url,
                                duration: cloudinaryResult.duration || 0,
                            }),
                        });

                        if (transcribeResponse.ok) {
                            const data = await transcribeResponse.json();
                            subtitles = data.subtitles || [];
                            setProgress(prev => [...prev, `✨ [${i + 1}] AI generated ${subtitles.length} subtitle lines!`]);
                        } else {
                            const errData = await transcribeResponse.json();
                            setProgress(prev => [...prev, `⚠️ [${i + 1}] AI transcription failed: ${errData.error || 'Unknown error'}`]);
                        }
                    } catch (err) {
                        console.error('AI Transcription error:', err);
                        setProgress(prev => [...prev, `⚠️ [${i + 1}] AI transcription error`]);
                    }
                } else if (form.subtitleFile) {
                    // Use uploaded SRT file
                    try {
                        const subtitleText = await form.subtitleFile.text();
                        const transcribeResponse = await fetch('/api/transcribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                mediaUrl: cloudinaryResult.secure_url,
                                duration: cloudinaryResult.duration || 0,
                                srtContent: subtitleText,
                            }),
                        });

                        if (transcribeResponse.ok) {
                            const data = await transcribeResponse.json();
                            subtitles = data.subtitles || [];
                            setProgress(prev => [...prev, `📝 [${i + 1}] Parsed ${subtitles.length} subtitle lines from SRT`]);
                        }
                    } catch (err) {
                        console.error('SRT parsing error:', err);
                        setProgress(prev => [...prev, `⚠️ [${i + 1}] SRT parsing error`]);
                    }
                }

                // 3. Create media entry in database
                const mediaData = {
                    title: form.title,
                    description: form.description,
                    type: form.type,
                    cloudinary_id: cloudinaryResult.public_id,
                    cloudinary_url: cloudinaryResult.secure_url,
                    thumbnail_url: cloudinaryResult.thumbnail_url,
                    duration: cloudinaryResult.duration || 0,
                    difficulty: form.difficulty,
                    category: form.category,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                };

                const response = await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mediaData),
                });

                if (!response.ok) {
                    throw new Error('Failed to create media entry');
                }

                const createdMedia = await response.json();
                setProgress(prev => [...prev, `✅ [${i + 1}] Created media entry: ${form.title}`]);

                // 4. Add subtitles to database
                if (subtitles.length > 0) {
                    await createSubtitles(createdMedia.id, subtitles);
                    setProgress(prev => [...prev, `✅ [${i + 1}] Saved subtitles for ${form.title}`]);
                }

                setProgress(prev => [...prev, `🎉 [${i + 1}/${forms.length}] Complete: ${form.title}`]);

            } catch (error) {
                console.error('Upload error:', error);
                setProgress(prev => [...prev, `❌ [${i + 1}] Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
            }
        }

        setUploading(false);
        setProgress(prev => [...prev, '🎊 All uploads complete!']);
    };

    return (
        <div className="admin-upload">
            <div className="admin-upload__header">
                <h1>📤 Bulk Media Upload</h1>
                <p>Upload multiple videos/audio files at once</p>
            </div>

            <div className="admin-upload__forms">
                {forms.map((form, index) => (
                    <div key={index} className="media-form">
                        <div className="media-form__header">
                            <h3>Media #{index + 1}</h3>
                            {forms.length > 1 && (
                                <button
                                    onClick={() => removeForm(index)}
                                    className="btn-remove"
                                >
                                    ❌ Remove
                                </button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => updateForm(index, 'title', e.target.value)}
                                    placeholder="e.g., Learn English with Adele - Hello"
                                />
                            </div>

                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => updateForm(index, 'type', e.target.value)}
                                >
                                    <option value="video">Video</option>
                                    <option value="audio">Audio</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateForm(index, 'description', e.target.value)}
                                    placeholder="Brief description of the content..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label>Difficulty</label>
                                <select
                                    value={form.difficulty}
                                    onChange={(e) => updateForm(index, 'difficulty', e.target.value as any)}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => updateForm(index, 'category', e.target.value)}
                                >
                                    <option value="music">Music</option>
                                    <option value="movies">Movies</option>
                                    <option value="podcasts">Podcasts</option>
                                    <option value="interviews">Interviews</option>
                                    <option value="tv-shows">TV Shows</option>
                                    <option value="documentaries">Documentaries</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={form.tags}
                                    onChange={(e) => updateForm(index, 'tags', e.target.value)}
                                    placeholder="e.g., music, pop, emotions, slow"
                                />
                            </div>

                            <div className="form-group">
                                <label>Media File * ({form.type})</label>
                                <input
                                    type="file"
                                    accept={form.type === 'video' ? 'video/*' : 'audio/*'}
                                    onChange={(e) => updateForm(index, 'file', e.target.files?.[0] || null)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Subtitles</label>
                                <div className="subtitle-options">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={form.useAI}
                                            onChange={(e) => updateForm(index, 'useAI', e.target.checked)}
                                            disabled={!!form.subtitleFile}
                                        />
                                        🤖 Generate with AI (Auto-transcribe & Translate)
                                    </label>

                                    <div className="or-divider">- OR -</div>

                                    <input
                                        type="file"
                                        accept=".srt"
                                        onChange={(e) => {
                                            updateForm(index, 'subtitleFile', e.target.files?.[0] || null);
                                            if (e.target.files?.[0]) {
                                                updateForm(index, 'useAI', false);
                                            }
                                        }}
                                    />
                                    <span className="help-text">Upload .srt file</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-upload__actions">
                <button onClick={addForm} className="btn-add">
                    ➕ Add Another Media
                </button>

                <button
                    onClick={handleBulkUpload}
                    disabled={uploading || forms.some(f => !f.title || !f.file)}
                    className="btn-upload"
                >
                    {uploading ? '⏳ Uploading...' : `🚀 Upload All (${forms.length})`}
                </button>
            </div>

            {progress.length > 0 && (
                <div className="upload-progress">
                    <h3>Upload Progress</h3>
                    <div className="progress-log">
                        {progress.map((msg, i) => (
                            <div key={i} className="progress-item">{msg}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper: Create subtitles in database
async function createSubtitles(mediaId: string, subtitles: any[]) {
    // Batch insert to avoid too many requests
    // Supabase can handle batch inserts
    const subtitlesWithId = subtitles.map(sub => ({
        media_id: mediaId,
        start_time: sub.start_time,
        end_time: sub.end_time,
        text_en: sub.text_en,
        text_ru: sub.text_ru,
        words: sub.words
    }));

    // Split into chunks of 50 to be safe
    const chunkSize = 50;
    for (let i = 0; i < subtitlesWithId.length; i += chunkSize) {
        const chunk = subtitlesWithId.slice(i, i + chunkSize);
        await fetch('/api/subtitles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chunk), // Send array for batch insert
        });
    }
}
