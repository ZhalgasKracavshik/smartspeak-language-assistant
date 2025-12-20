import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - SmartSpeak',
    description: 'Privacy Policy for SmartSpeak Language Assistant',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Last updated: December 3, 2025
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">1. Information We Collect</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We collect information you provide when creating an account:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                        <li>Email address and profile information</li>
                        <li>Learning progress and preferences</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">2. How We Use Your Information</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Your information is used to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                        <li>Personalize English learning content based on your interests</li>
                        <li>Track your learning progress</li>
                        <li>Improve our recommendation algorithms</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">3. Data Security</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We use industry-standard encryption and security measures to protect your data.
                        We never store your passwords in plain text.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">4. Data Retention and Deletion</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        You can delete your data at any time from your Profile settings. Upon deletion,
                        all associated data is permanently removed from our servers within 30 days.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">5. Children's Privacy</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Our service is intended for users aged 13 and older. We do not knowingly collect data from children under 13.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">6. Contact Us</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        If you have questions about this Privacy Policy, please contact us through the app's support channel.
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
