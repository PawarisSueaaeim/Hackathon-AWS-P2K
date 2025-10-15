import Layout from '@/components/layout';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, BarChart3, Users, TrendingUp, Activity, Zap, Brain, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl p-8 border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                                Welcome to AI Platform
                            </h1>
                            <p className="text-lg text-muted-foreground font-body">
                                Experience the future of AI-powered productivity with our intelligent assistants
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center space-x-4">
        <Image
                                src="/pic/ai-man.png"
                                alt="AI Assistant - Male"
                                width={120}
                                height={180}
                                className="drop-shadow-lg"
                            />
            <Image
                                src="/pic/ai-woman.png"
                                alt="AI Assistant - Female"
                                width={120}
                                height={180}
                                className="drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-border/50 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground font-body">Total Conversations</h3>
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-display">2,350</div>
                            <p className="text-xs text-green-600 font-body">
                                <TrendingUp className="inline w-3 h-3 mr-1" />
                                +12.5% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground font-body">Active Users</h3>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-display">1,247</div>
                            <p className="text-xs text-green-600 font-body">
                                <TrendingUp className="inline w-3 h-3 mr-1" />
                                +8.2% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground font-body">AI Assistants</h3>
                            <Bot className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-display">24</div>
                            <p className="text-xs text-blue-600 font-body">
                                <Zap className="inline w-3 h-3 mr-1" />
                                All systems operational
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground font-body">Response Time</h3>
                            <Activity className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-display">0.8s</div>
                            <p className="text-xs text-green-600 font-body">
                                <Brain className="inline w-3 h-3 mr-1" />
                                Ultra-fast responses
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border/50">
                        <CardHeader>
                            <h3 className="text-lg font-semibold font-display">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground font-body">
                                Get started with our most popular features
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-between h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                <span className="flex items-center font-medium">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Start New Conversation
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between h-12">
                                <span className="flex items-center font-medium">
                                    <Bot className="w-4 h-4 mr-2" />
                                    Create AI Assistant
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between h-12">
                                <span className="flex items-center font-medium">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Analytics
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader>
                            <h3 className="text-lg font-semibold font-display">Recent Activity</h3>
                            <p className="text-sm text-muted-foreground font-body">
                                Your latest interactions and updates
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium font-body">New conversation with Alex</p>
                                    <p className="text-xs text-muted-foreground font-body">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium font-body">Sofia completed task</p>
                                    <p className="text-xs text-muted-foreground font-body">15 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium font-body">Performance metrics updated</p>
                                    <p className="text-xs text-muted-foreground font-body">1 hour ago</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
        </div>

                {/* AI Assistants Preview */}
                <Card className="border-border/50">
                    <CardHeader>
                        <h3 className="text-lg font-semibold font-display">Meet Your AI Assistants</h3>
                        <p className="text-sm text-muted-foreground font-body">
                            Our intelligent assistants are ready to help you with any task
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50">
          <Image
                                    src="/pic/ai-man.png"
                                    alt="AI Assistant - Male"
                                    width={80}
                                    height={120}
                                    className="rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold font-display text-lg">Alex</h4>
                                    <p className="text-sm text-muted-foreground font-body mb-2">
                                        Technical Assistant - Expert in coding, debugging, and technical solutions
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 font-body">Online & Ready</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 border border-pink-200/50 dark:border-pink-800/50">
          <Image
                                    src="/pic/ai-woman.png"
                                    alt="AI Assistant - Female"
                                    width={80}
                                    height={120}
                                    className="rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold font-display text-lg">Sofia</h4>
                                    <p className="text-sm text-muted-foreground font-body mb-2">
                                        Creative Assistant - Specialized in design, content creation, and creative tasks
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 font-body">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
