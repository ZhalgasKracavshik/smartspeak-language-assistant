'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ActivityCalendarProps {
    data: { date: string; count: number }[];
}

export function ActivityCalendar({ data }: ActivityCalendarProps) {
    // Generate dates for the last 365 days
    const today = new Date();
    const days = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d);
    }

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-200 dark:bg-slate-700 border border-gray-300';
        if (count < 15) return 'bg-green-200 dark:bg-green-900/40';
        if (count < 30) return 'bg-green-400 dark:bg-green-700';
        if (count < 60) return 'bg-green-600 dark:bg-green-500';
        return 'bg-green-800 dark:bg-green-400';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-1">
                    {days.map((date, i) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const entry = data.find(d => d.date === dateStr);
                        const count = entry?.count || 0;

                        return (
                            <TooltipProvider key={i}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div
                                            className={`w-3 h-3 rounded-sm ${getColor(count)}`}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{date.toLocaleDateString()}: {count} minutes</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-gray-100 dark:bg-slate-800 rounded-sm" />
                    <div className="w-3 h-3 bg-green-200 dark:bg-green-900/40 rounded-sm" />
                    <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm" />
                    <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />
                    <div className="w-3 h-3 bg-green-800 dark:bg-green-400 rounded-sm" />
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    );
}
