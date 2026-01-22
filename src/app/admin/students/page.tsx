'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface StudentData {
    id: string;
    full_name: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
    modules_completed: number;
    last_active: string;
    is_at_risk: boolean;
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        atRisk: 0,
        avgProgress: 0
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const supabase = createClient();

            // Get all user profiles with progress data
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('xp', { ascending: false });

            if (error) throw error;

            // Process and enrich student data
            const enrichedData: StudentData[] = (data || []).map((user: any) => ({
                id: user.id,
                full_name: user.full_name || 'Anonymous',
                email: user.email || 'N/A',
                xp: user.xp || 0,
                level: user.level || 1,
                streak: user.streak || 0,
                modules_completed: Math.floor((user.xp || 0) / 500), // Approx
                last_active: user.updated_at,
                is_at_risk: (user.streak || 0) === 0 && (user.xp || 0) < 100
            }));

            setStudents(enrichedData);

            // Calculate stats
            const total = enrichedData.length;
            const active = enrichedData.filter(s => s.streak > 0).length;
            const atRisk = enrichedData.filter(s => s.is_at_risk).length;
            const avgProgress = total > 0
                ? enrichedData.reduce((sum, s) => sum + s.modules_completed, 0) / total
                : 0;

            setStats({ total, active, atRisk, avgProgress: Math.round(avgProgress) });
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
                <p className="text-gray-500">Monitor individual student performance and engagement</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Students</p>
                                <h3 className="text-2xl font-bold">{stats.total}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Active (Streak)</p>
                                <h3 className="text-2xl font-bold">{stats.active}</h3>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">At Risk</p>
                                <h3 className="text-2xl font-bold text-red-600">{stats.atRisk}</h3>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Avg Modules</p>
                                <h3 className="text-2xl font-bold">{stats.avgProgress}</h3>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-semibold text-gray-700">Student</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Level</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">XP</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Streak</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Modules</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        className={`border-b hover:bg-gray-50 transition-colors ${student.is_at_risk ? 'bg-red-50' : ''
                                            }`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {student.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{student.full_name}</p>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                Level {student.level}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-gray-900">{student.xp.toLocaleString()}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {student.streak > 0 ? (
                                                    <>
                                                        <span className="text-xl">🔥</span>
                                                        <span className="font-semibold text-orange-600">{student.streak} days</span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">No streak</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-gray-900">{student.modules_completed} / 9</span>
                                        </td>
                                        <td className="p-4">
                                            {student.is_at_risk ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    At Risk
                                                </span>
                                            ) : student.streak > 7 ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                                                    <TrendingUp className="w-4 h-4" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
