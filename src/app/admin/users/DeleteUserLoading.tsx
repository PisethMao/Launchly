"use client";
import { Trash2, Loader2 } from "lucide-react";

export function UserDeleteLoading() {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-red-200 dark:border-red-900 animate-scale-in">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Animated Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                            <Trash2 className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>

                    {/* Loading Spinner */}
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />

                    {/* Text Content */}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                            Deleting User...
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Please wait while we remove this user from the
                            system
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-progress"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes progress {
                    0% {
                        width: 0%;
                    }
                    50% {
                        width: 70%;
                    }
                    100% {
                        width: 100%;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }

                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default UserDeleteLoading;
