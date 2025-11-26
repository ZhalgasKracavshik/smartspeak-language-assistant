'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for MVP security
        // In production, verify against database/auth service
        if (password === 'admin123') {
            // Set cookie
            document.cookie = "admin_access=true; path=/; max-age=86400"; // 1 day
            router.push('/admin/upload');
        } else {
            setError('Invalid password');
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
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Password"
                    style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #6366f1',
                        background: '#1e293b',
                        color: 'white'
                    }}
                />
                {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
                <button
                    type="submit"
                    style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
}
