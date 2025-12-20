'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '../components/Dashboard';
import { getUserProfileService } from '../services/userProfileService';
import { timeTrackingService } from '../services/timeTrackingService';
import { Onboarding } from '../components/Onboarding';
import { supabase } from '@/lib/supabase';

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            timeTrackingService.startTracking();

            // Check if guest
            const isGuest = localStorage.getItem('smartspeak-is-guest') === 'true';
            if (isGuest) {
                setIsLoading(false);
                return;
            }

            // Check supabase session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            // Check profile and onboarding
            const profileService = getUserProfileService();
            const profile = profileService.getProfile();

            if (profile && !profileService.hasCompletedOnboarding()) {
                setShowOnboarding(true);
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (showOnboarding) {
        return <Onboarding onComplete={() => setShowOnboarding(false)} />;
    }

    return (
        <Dashboard
            onNavigate={(path) => {
                if (path === 'dashboard') router.push('/');
                else if (path === 'profile') router.push('/profile');
                else router.push(`/learning/${path}`);
            }}
            activeTab="dashboard"
            onLogout={async () => {
                await supabase.auth.signOut();
                localStorage.removeItem('smartspeak-is-guest');
                router.push('/login');
            }}
        />
    );
}
