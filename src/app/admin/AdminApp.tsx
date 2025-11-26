"use client";
import { useState } from "react";
import { Dashboard } from "./dashboard/AdminDashboard";
import { ProjectsManagement } from "./projects/UserProject";
import { UsersManagement } from "./users/ManageUser";
import { LayoutDashboard, FolderGit2, Users } from "lucide-react";

export default function App() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "projects", label: "Projects", icon: FolderGit2 },
        { id: "users", label: "Users", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30 transition-colors duration-500">
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s ease-out;
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.1) 50%,
                        transparent 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 3s infinite;
                }
            `}</style>

            {/* Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-3 py-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-xl">A</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                                    Admin Panel
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Management Console
                                </p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                                            isActive
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-5 h-5 transition-transform duration-300 ${
                                                isActive ? "scale-110" : "group-hover:scale-110"
                                            }`}
                                        />
                                        <span>{tab.label}</span>
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-xl animate-shimmer"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="animate-fade-in">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "projects" && <ProjectsManagement />}
                    {activeTab === "users" && <UsersManagement />}
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
