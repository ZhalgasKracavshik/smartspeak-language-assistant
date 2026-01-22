'use client';

import { GrammarTopic } from '@/services/contentService';

interface GrammarSectionProps {
    rules: GrammarTopic[];
}

export default function GrammarSection({ rules }: GrammarSectionProps) {
    return (
        <div className="space-y-6">
            {rules.map((rule) => (
                <div
                    key={rule.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-blue-100 dark:border-blue-800/30">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {rule.title_en}
                        </h3>
                        {rule.title_ru && (
                            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                                {rule.title_ru}
                            </p>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Rules Column - Takes 2/3 width */}
                            <div className="lg:col-span-2 space-y-4">
                                <div>
                                    <h4 className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                                        Grammar Rule / Ереже
                                    </h4>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-4">
                                            {rule.rule_en}
                                        </p>
                                        {rule.rule_ru && (
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {rule.rule_ru}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Examples Column - Takes 1/3 width */}
                            <div className="lg:col-span-1">
                                <h4 className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></span>
                                    Examples / Мысалдар
                                </h4>
                                <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 p-5 space-y-3">
                                    {rule.examples && rule.examples.length > 0 ? (
                                        rule.examples.map((example, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="min-w-[4px] w-1 bg-green-400/50 rounded-full mt-1.5 mb-1.5"></div>
                                                <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
                                                    "{example}"
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No examples provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {rules.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No grammar rules available for this module yet.
                </div>
            )}
        </div>
    );
}
