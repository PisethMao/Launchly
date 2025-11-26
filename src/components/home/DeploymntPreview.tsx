"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function DeploymentPreview() {
    const [activeTab, setActiveTab] = useState("overview");
    const [deployStatus, setDeployStatus] = useState("success");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="font-poppins relative isolate py-32 overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20" />

            {/* Animated gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            />

            <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-6"
                    >
                        <span className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase border border-blue-200/50 dark:border-blue-700/50">
                            Live Demo
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6"
                    >
                        See Launchly in Action
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        A clean deployment dashboard that makes going live feel
                        effortless.
                    </motion.p>
                </div>

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-2xl" />

                    {/* Main container */}
                    <div className="relative mx-auto max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                        {/* Browser Chrome */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" />
                                <div className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer" />
                            </div>

                            <div className="flex-1 mx-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <svg
                                    className="w-4 h-4 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                                    https://myapp.launchly.app
                                </span>
                            </div>

                            <div className="w-20" />
                        </div>

                        {/* Dashboard Content */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-8">
                            {/* Sidebar & Main Content Layout */}
                            <div className="flex gap-6">
                                {/* Sidebar */}
                                <div className="w-48 space-y-2">
                                    {[
                                        "Overview",
                                        "Deployments",
                                        "Settings",
                                        "Logs",
                                    ].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() =>
                                                setActiveTab(tab.toLowerCase())
                                            }
                                            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                                activeTab === tab.toLowerCase()
                                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 space-y-6">
                                    {/* Deployment Status Card */}
                                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                Latest Deployment
                                            </h3>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                    Live
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Build Time
                                                </span>
                                                <span className="font-mono text-gray-900 dark:text-white">
                                                    2m 34s
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Branch
                                                </span>
                                                <span className="font-mono text-blue-600 dark:text-blue-400">
                                                    main
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Commit
                                                </span>
                                                <span className="font-mono text-gray-900 dark:text-white">
                                                    a3f2c91
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                <span>Deployment Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            {
                                                label: "Requests",
                                                value: "1.2M",
                                                trend: "+12%",
                                                color: "blue",
                                            },
                                            {
                                                label: "Uptime",
                                                value: "99.9%",
                                                trend: "+0.1%",
                                                color: "green",
                                            },
                                            {
                                                label: "Response",
                                                value: "45ms",
                                                trend: "-8ms",
                                                color: "purple",
                                            },
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{ delay: i * 0.1 }}
                                                className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                                            >
                                                <div
                                                    className={`text-2xl font-bold bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 bg-clip-text text-transparent`}
                                                >
                                                    {stat.value}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {stat.label}
                                                </div>
                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                                                    {stat.trend}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Activity Feed */}
                                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            Recent Activity
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    action: "Deployment successful",
                                                    time: "2 min ago",
                                                    icon: "✓",
                                                    color: "green",
                                                },
                                                {
                                                    action: "Build started",
                                                    time: "5 min ago",
                                                    icon: "⚡",
                                                    color: "blue",
                                                },
                                                {
                                                    action: "Code pushed to main",
                                                    time: "6 min ago",
                                                    icon: "↑",
                                                    color: "purple",
                                                },
                                            ].map((activity, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex items-center justify-center`}
                                                    >
                                                        <span className="text-sm">
                                                            {activity.icon}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {activity.action}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {activity.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-16"
                >
                </motion.div>
            </div>
        </section>
    );
}
