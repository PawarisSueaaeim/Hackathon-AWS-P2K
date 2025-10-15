'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('ProtectedRoute - Auth state:', { isAuthenticated, isLoading, user: user?.name });
        
        if (!isLoading && !isAuthenticated) {
            console.log('ProtectedRoute - Redirecting to login...');
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router, user]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-body">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
