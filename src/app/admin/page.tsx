'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Video, Users, Activity, BookMarked, FileText, Upload, Sword } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const navigationCards = [
        {
            title: 'Vocabulary',
            description: 'Manage vocabulary words and translations',
            icon: BookOpen,
            color: 'purple',
            path: '/admin/vocabulary'
        },
        {
            title: 'Grammar',
            description: 'Create and edit grammar topics',
            icon: BookMarked,
            color: 'blue',
            path: '/admin/grammar'
        },
        {
            title: 'Videos',
            description: 'Manage video content library',
            icon: Video,
            color: 'pink',
            path: '/admin/videos'
        },
        {
            title: 'Articles',
            description: 'Create and manage articles',
            icon: FileText,
            color: 'green',
            path: '/admin/articles'
        },
        {
            title: 'Media Upload',
            description: 'Upload videos and audio files',
            icon: Upload,
            color: 'orange',
            path: '/admin/upload'
        },
        {
            title: 'Quests',
            description: 'Manage daily challenges',
            icon: Sword,
            color: 'red',
            path: '/admin/quests'
        },
        {
            title: 'Students',
            description: 'View student progress and analytics',
            icon: Users,
            color: 'teal',
            path: '/admin/students'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Welcome back, Admin. Manage your SmartSpeak content.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold">1,234</h3>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <Activity className="size-3 mr-1" /> +12% this month
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-purple-100 rounded-xl text-purple-600">
                            <BookOpen className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Vocabulary</p>
                            <h3 className="text-2xl font-bold">856</h3>
                            <p className="text-xs text-gray-500 mt-1">Total words</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-pink-100 rounded-xl text-pink-600">
                            <Video className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Video Content</p>
                            <h3 className="text-2xl font-bold">42</h3>
                            <p className="text-xs text-gray-500 mt-1">Active videos</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
                            <Activity className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Daily Active</p>
                            <h3 className="text-2xl font-bold">89</h3>
                            <p className="text-xs text-gray-500 mt-1">Users today</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Management Cards */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {navigationCards.map((card) => {
                        const Icon = card.icon;
                        const colorClasses = {
                            purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
                            blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                            pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
                            green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                            orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
                            red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                            teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                        };

                        return (
                            <Link key={card.title} href={card.path}>
                                <Card className="h-full transition-all hover:shadow-xl cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className={`p-4 bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses]} rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform`}>
                                            <Icon className="size-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                                        <p className="text-sm text-gray-500">{card.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* System Status */}
            <Card>
                <CardHeader>
                    <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-medium text-green-900">Database</span>
                            </div>
                            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-medium text-green-900">AI Services</span>
                            </div>
                            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-medium text-green-900">Storage</span>
                            </div>
                            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
