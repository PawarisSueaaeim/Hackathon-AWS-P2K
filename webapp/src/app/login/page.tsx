'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, error: authError, clearError } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (email || password) {
            setLocalError('');
            setSuccessMessage('');
            clearError();
        }
    }, [email, password, clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        clearError();
        setIsLoading(true);

        try {
            const result = await login(email, password);
            console.log('Login result:', result);
            
            if (result.success) {
                setSuccessMessage('Login successful! Redirecting...');
            } else {
                setLocalError(result.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setLocalError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const mockCredentials = [
        { label: 'Admin', email: 'admin@example.com', password: 'admin123' },
        { label: 'User', email: 'user@example.com', password: 'user123' },
        { label: 'Demo', email: 'demo@example.com', password: 'demo123' }
    ];

    const fillCredentials = (email: string, password: string) => {
        setEmail(email);
        setPassword(password);
        setLocalError('');
        setSuccessMessage('');
        clearError();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            <div className="flex min-h-screen">
                {/* Left Side - AI Characters Showcase */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 font-display">
                                Welcome to the Future
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md font-body">
                                Experience the power of AI-driven solutions with our intelligent platform
                            </p>
                        </div>

                        <div className="flex space-x-8 items-end">
                            <div className="text-center group">
                                <div className="relative mb-4 transform group-hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src="/pic/ai-woman.png"
                                        alt="AI Assistant - Female"
                                        width={200}
                                        height={300}
                                        className="drop-shadow-2xl"
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 font-display">Sofia</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-body">AI Assistant</p>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                    style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                                    style={{ animationDelay: '0.2s' }}
                                ></div>
                                <span className="ml-2 text-sm font-body">AI-Powered Platform</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 font-display">Sign In</h2>
                            <p className="text-slate-600 dark:text-slate-400 font-body">Access your AI-powered workspace</p>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 font-display">Demo Credentials:</h3>
                            <div className="space-y-2">
                                {mockCredentials.map((cred) => (
                                    <button
                                        key={cred.email}
                                        onClick={() => fillCredentials(cred.email, cred.password)}
                                        className="w-full text-left text-xs p-2 bg-white dark:bg-blue-900/50 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/70 transition-colors font-body"
                                    >
                                        <span className="font-medium text-blue-700 dark:text-blue-300">{cred.label}:</span> {cred.email} / {cred.password}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader className="space-y-1 pb-4">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {successMessage && (
                                        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                                            <p className="text-sm text-green-600 dark:text-green-400 font-body">
                                                {successMessage}
                                            </p>
                                        </div>
                                    )}
                                    {(localError || authError) && (
                                        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                                            <p className="text-sm text-red-600 dark:text-red-400 font-body">
                                                {localError || authError}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body">
                                            Email Address or Username
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter your email or username"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 font-body"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body">
                                            Password
                                        </Label>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 font-body"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 font-body">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>Remember me</span>
                                        </Label>
                                        <Link
                                            href="#"
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-body"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="font-body">Signing In...</span>
                                            </div>
                                        ) : (
                                            <span className="font-body">Sign In</span>
                                        )}
                                    </Button>
                                </form>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-body">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-12 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        <span className="font-body">Google</span>
                                    </Button>
                                    <Button variant="outline" className="h-12 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                        <span className="font-body">Twitter</span>
                                    </Button>
                                </div>

                                <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-body">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                </CardContent>
            </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
