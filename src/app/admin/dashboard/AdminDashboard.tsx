/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import {
    Search,
    Users,
    FolderGit2,
    Rocket,
    TrendingUp,
    LogOut,
    Sparkles,
    Activity,
    Zap,
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { baseUrl } from "@/utils/urls";
import { ActivityPulse } from "@/components/admin/AdminComponents";

// Mock data for demo
const mockStats = {
    totalUsers: 1247,
    totalProjects: 856,
    activeDeployments: 423,
    newUsersThisMonth: 89,
    projectsThisMonth: 134,
    deploymentsThisMonth: 67,
};

function StatCard({
    icon: Icon,
    title,
    value,
    change,
    color,
    delay,
}: {
    icon: React.ComponentType<{ className: string }>;
    title: string;
    value: number;
    change?: number;
    color: string;
    delay: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), delay);
    }, [delay]);

    useEffect(() => {
        if (!isVisible) return;
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCounter(value);
                clearInterval(timer);
            } else {
                setCounter(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div
            className={`relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-700 ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
            } hover:scale-105 hover:shadow-2xl group cursor-pointer`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                        {title}
                        <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                    </p>
                    <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {counter.toLocaleString()}
                    </h3>
                    {change && (
                        <div className="flex items-center gap-2 animate-bounce">
                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                                <TrendingUp className="w-3 h-3 text-white mr-1" />
                                <span className="text-white font-bold text-xs">
                                    +{change}
                                </span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                                this month
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`p-4 rounded-2xl ${color} shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
                >
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    );
}

export function Dashboard() {
    const [loaded, setLoaded] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        activeDeployments: 0,
    });

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admin/stats", {
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to fetch stats", await res.text());
                return;
            }

            setStats(await res.json());
        }

        setLoaded(true);
        load();
    }, []);

    return (
        <div className="space-y-8">
            <div
                className={`flex items-center justify-between transform transition-all duration-700 ${
                    loaded
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-8 opacity-0"
                }`}
            >
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-lg">
                        <ActivityPulse />
                        Monitor and manage your platform in real-time
                    </p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: `${baseUrl}` })}
                    className="group flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300 active:scale-95 transform hover:scale-105 shadow-md hover:shadow-xl dark:text-white"
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={stats.totalUsers + mockStats.totalUsers}
                    change={mockStats.newUsersThisMonth}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    delay={0}
                />
                <StatCard
                    icon={FolderGit2}
                    title="Total Projects"
                    value={stats.totalProjects + mockStats.totalProjects}
                    change={mockStats.projectsThisMonth}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    delay={150}
                />
                <StatCard
                    icon={Rocket}
                    title="Active Deployments"
                    value={
                        stats.activeDeployments + mockStats.activeDeployments
                    }
                    change={mockStats.deploymentsThisMonth}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    delay={300}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-2xl shadow-lg p-6 border border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            System Activity
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                API Requests (Today)
                            </span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">
                                12,847
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Avg Response Time
                            </span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                                142ms
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl shadow-lg p-6 border border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Quick Actions
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <button
                        className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-all text-left font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transform hover:translate-x-2">
                            View Recent Signups →
                        </button>
                        <button className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-all text-left font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transform hover:translate-x-2">
                            Check Failed Deployments →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
