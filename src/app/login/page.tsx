'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Auth } from '@/components/Auth';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if guest first
        const isGuest = localStorage.getItem('smartspeak-is-guest') === 'true';
        if (isGuest) {
            router.push('/');
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push('/');
            } else {
                setLoading(false);
            }
        });
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
            <Auth initialMode="login" onLogin={() => router.push('/')} />
        </div>
    );
}
