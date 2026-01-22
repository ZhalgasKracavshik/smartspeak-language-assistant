'use client';

import React from 'react';
import { AdminGuard } from '../../components/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Video, FileText, Settings, LogOut, Sword, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, path: '/admin/vocabulary' },
        { id: 'grammar', label: 'Grammar', icon: BookMarked, path: '/admin/grammar' },
        { id: 'videos', label: 'Videos', icon: Video, path: '/admin/videos' },
        { id: 'articles', label: 'Articles', icon: FileText, path: '/admin/articles' },
        { id: 'quests', label: 'Quests', icon: Sword, path: '/admin/quests' },
    ];

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-gray-50">
                {/* Admin Sidebar */}
                <aside className="w-64 bg-slate-900 text-white fixed h-full z-10 hidden md:flex flex-col">
                    <div className="p-6 border-b border-slate-800">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            SmartSpeak Admin
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Content Management</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="size-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                            <LogOut className="size-5" />
                            <span className="font-medium">Exit to App</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-8">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
