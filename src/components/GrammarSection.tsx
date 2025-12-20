'use client';

interface GrammarRule {
    id: string;
    module: number;
    title: string;
    description: string;
    rules: string[];
    examples: string[];
}

interface GrammarSectionProps {
    rules: GrammarRule[];
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
                            {rule.title}
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                            {rule.description}
                        </p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rules Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Rules
                            </h4>
                            <ul className="space-y-2">
                                {rule.rules.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300 text-sm">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Examples Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Examples
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                                {rule.examples.map((example, idx) => (
                                    <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 italic">
                                        "{example}"
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
