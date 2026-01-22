'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check direct auth state
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    console.log('AdminGuard: No session');
                    router.push('/login');
                    return;
                }

                // Verify role directly from DB to avoid Service race conditions
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (profile && profile.role === 'admin') {
                    console.log('AdminGuard: Authorized');
                    setIsAuthorized(true);
                } else {
                    console.log('AdminGuard: Unauthorized', profile?.role);
                    router.push('/');
                }
            } catch (error) {
                console.error('Admin guard error:', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500">Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
