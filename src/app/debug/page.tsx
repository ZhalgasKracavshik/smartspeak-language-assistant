'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setData({ error: 'Not logged in' });
            setLoading(false);
            return;
        }

        const [accounts, interests, recommendations] = await Promise.all([
            supabase.from('connected_accounts').select('*').eq('user_id', user.id),
            supabase.from('user_interests').select('*').eq('user_id', user.id),
            supabase.from('daily_recommendations').select('*').eq('user_id', user.id)
        ]);

        setData({
            user: { id: user.id, email: user.email },
            accounts: accounts.data,
            interests: interests.data,
            recommendations: recommendations.data,
            errors: {
                accounts: accounts.error,
                interests: interests.error,
                recommendations: recommendations.error
            }
        });
        setLoading(false);
    };

    const handleAction = async (action: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/recommendations/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ analyze: action === 'analyze' })
            });
            const result = await res.json();
            alert(JSON.stringify(result, null, 2));
            fetchData();
        } catch (error) {
            alert('Error: ' + error);
        } finally {
            setActionLoading(false);
        }
    };

    const testDBWrite = async () => {
        setActionLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user');

            const { error } = await supabase
                .from('connected_accounts')
                .upsert({
                    user_id: user.id,
                    provider: 'test_write',
                    access_token: 'test',
                    refresh_token: 'test',
                    expires_at: new Date().toISOString()
                }, { onConflict: 'user_id,provider' });

            if (error) throw error;
            alert('Write successful! RLS is fine.');
            // Clean up
            await supabase.from('connected_accounts').delete().eq('provider', 'test_write');
            fetchData();
        } catch (error: any) {
            alert('Write Failed: ' + (error.message || JSON.stringify(error)));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading debug data...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Debug Dashboard</h1>

            <div className="flex gap-4 flex-wrap">
                <Button onClick={fetchData}>Refresh Data</Button>
                <Button onClick={() => handleAction('generate')} disabled={actionLoading}>
                    Force Generate Recommendations
                </Button>
                <Button onClick={() => handleAction('analyze')} disabled={actionLoading} variant="secondary">
                    Force Analyze Interests
                </Button>
                <Button onClick={testDBWrite} disabled={actionLoading} variant="destructive">
                    Test DB Write Permissions
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>User Info</CardTitle></CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(data?.user, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Connected Accounts ({data?.accounts?.length})</CardTitle></CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                        {JSON.stringify(data?.accounts, null, 2)}
                    </pre>
                    {data?.errors?.accounts && <div className="text-red-500 mt-2">{JSON.stringify(data.errors.accounts)}</div>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>User Interests ({data?.interests?.length})</CardTitle></CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                        {JSON.stringify(data?.interests, null, 2)}
                    </pre>
                    {data?.errors?.interests && <div className="text-red-500 mt-2">{JSON.stringify(data.errors.interests)}</div>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Daily Recommendations ({data?.recommendations?.length})</CardTitle></CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                        {JSON.stringify(data?.recommendations, null, 2)}
                    </pre>
                    {data?.errors?.recommendations && <div className="text-red-500 mt-2">{JSON.stringify(data.errors.recommendations)}</div>}
                </CardContent>
            </Card>
        </div>
    );
}
