import type { Metadata } from 'next';
import './globals.css';
import { getAllFontVariables } from '@/lib/fonts';
import { AuthProvider } from '@/contexts/auth-context';
import { ReduxProvider } from '@/store/providers';
import Layout from '@/components/layout';

export const metadata: Metadata = {
    title: 'AI Platform - Hackathon Agentic AI',
    description: 'Modern AI-powered platform with intelligent assistants',
    keywords: ['AI', 'Artificial Intelligence', 'Assistants', 'Chatbot', 'Machine Learning'],
    authors: [{ name: 'Hackathon Team' }],
    viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${getAllFontVariables()} font-sans antialiased`} suppressHydrationWarning>
                <ReduxProvider>
                    <AuthProvider>
                        <Layout>
                            {children}
                        </Layout>
                    </AuthProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
