import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { MainLayout } from '../components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SmartSpeak Language Assistant',
    description: 'AI-powered language learning assistant',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={inter.className}>
                <LanguageProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </LanguageProvider>
            </body>
        </html>
    );
}
