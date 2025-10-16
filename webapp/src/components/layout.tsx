'use client';

import { useState } from 'react';
import { Search, User, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import Sidebar from './sidebar';
import Image from 'next/image';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { useAppDispatch } from '@/store/hooks';
import { toggleDarkMode, toggleMobileSidebar } from '@/store/toggleSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const dispatch = useAppDispatch();
    const { user, logout } = useAuth();

    const { isDarkMode } = useSelector((state: RootState) => state.toggleReducer);

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    };

    const handleOpenSidebar = () => {
        dispatch(toggleMobileSidebar());
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                    {/* Top Header */}
                    <header className="bg-card border-b border-border px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <FaEllipsisVertical className="block lg:hidden text-black dark:text-white" onClick={handleOpenSidebar} />
                                <h1 className="text-2xl font-display font-semibold text-foreground">Dashboard</h1>
                                <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>/</span>
                                    <span>Overview</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Search */}
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search anything..."
                                        className="pl-10 w-64 bg-muted/50 border-border focus:ring-ring"
                                    />
                                </div>

                                {/* Theme Toggle */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleToggleDarkMode}
                                    className="h-9 w-9 p-0"
                                >
                                    {isDarkMode ? <Sun className="text-black dark:text-white w-4 h-4" /> : <Moon className="text-black dark:text-white w-4 h-4" />}
                                </Button>

                                {/* User Profile */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        {user?.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className="hidden md:block text-sm">
                                            <p className="font-medium text-foreground font-body">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground font-body">{user?.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                        title="Logout"
                                    >
                                        <LogOut className="text-black dark:text-white w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto bg-muted/30">
                        <div className="p-6">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
