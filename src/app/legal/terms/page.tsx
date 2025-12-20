import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - SmartSpeak',
    description: 'Terms of Service for SmartSpeak Language Assistant',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Last updated: December 3, 2025
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        By accessing and using SmartSpeak Language Assistant, you accept and agree to be bound by these Terms of Service.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">2. Use of Service</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        SmartSpeak is an educational platform designed to help users learn English through personalized content recommendations.
                        You agree to use this service only for lawful purposes and in accordance with these Terms.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">3. Data Usage</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We use your data solely to improve your English learning experience. Please refer to our Privacy Policy for detailed
                        information about data collection and usage.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">4. Termination</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        You may delete your account and data at any time from your Profile settings.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">5. Contact</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        For questions about these Terms, please contact us through the app's support channel.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <a href="/" className="text-purple-600 dark:text-purple-400 hover:underline">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
