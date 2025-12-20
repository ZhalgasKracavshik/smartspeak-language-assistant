'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if user is authenticated with Supabase
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Please sign in first');
                setLoading(false);
                return;
            }

            // Check if user email matches admin email from environment
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

            if (user.email !== adminEmail) {
                setError('Unauthorized access');
                setLoading(false);
                return;
            }

            // Set secure cookie
            document.cookie = "admin_access=true; path=/; max-age=86400; SameSite=Strict; Secure";
            router.push('/admin/upload');
        } catch (err) {
            setError('Authentication failed');
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0f172a',
            color: 'white'
        }}>
            <h1>🔐 Admin Access</h1>
            <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>
                Admin access is restricted to authorized accounts
            </p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: loading ? '#475569' : '#6366f1',
                        color: 'white',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Checking...' : 'Verify Admin Access'}
                </button>
            </form>
        </div>
    );
}
