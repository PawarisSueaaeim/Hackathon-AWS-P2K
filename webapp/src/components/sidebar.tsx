/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    MessageSquare,
    Bot,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    badge?: string;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/',
        icon: Home,
    },
    {
        name: 'AI Assistants',
        href: '/assistants',
        icon: Bot,
        badge: 'New',
    },
    {
        name: 'Conversations',
        href: '/conversations',
        icon: MessageSquare,
    },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const handleLogout = () => {
        logout();
    };

    const isActive = (href: string) => {
        return pathname === href;
    };

    const SidebarContent = () => (
        <div
            className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg text-sidebar-foreground">AI Platform</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="hidden lg:flex h-8 w-8 p-0 hover:bg-sidebar-accent"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>

            {/* Search */}
            {!isCollapsed && (
                <div className="p-4 border-b border-sidebar-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 bg-sidebar-accent border-sidebar-border focus:ring-sidebar-ring"
                        />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                active
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        >
                            <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {isCollapsed && item.badge && (
                                <div className="absolute right-1 top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-sidebar-border">
                {isCollapsed ? (
                    <div className="flex justify-center">
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
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
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
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sidebar-foreground truncate font-body">
                                {user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate font-body">{user?.email}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMobileSidebar} />}

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 lg:hidden z-50 transform transition-transform duration-300 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent />
            </div>

            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex`}>
                <SidebarContent />
            </div>

            {/* Mobile Header */}
            <div className="hidden flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg text-sidebar-foreground">AI Platform</span>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleMobileSidebar} className="h-8 w-8 p-0">
                    {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>
        </>
    );
}
