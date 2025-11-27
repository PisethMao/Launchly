/* eslint-disable react-hooks/purity */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Loading Component
export function DeploymentLoading({ isOpen, projectName, onClose } : { isOpen: any; projectName?: any; onClose?: () => void }) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { icon: "📦", label: "Cloning repository", duration: 2000 },
        { icon: "🔍", label: "Analyzing project structure", duration: 1500 },
        { icon: "⚙️", label: "Installing dependencies", duration: 3000 },
        { icon: "🔨", label: "Building project", duration: 2500 },
        { icon: "🚀", label: "Deploying to server", duration: 2000 },
        { icon: "✅", label: "Deployment complete!", duration: 1000 }
    ];

    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            setCurrentStep(0);
            return;
        }

        // Simulate deployment progress
        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += 100;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
            setProgress(newProgress);

            // Update current step based on progress
            let stepProgress = 0;
            for (let i = 0; i < steps.length; i++) {
                stepProgress += steps[i].duration;
                if (elapsed < stepProgress) {
                    setCurrentStep(i);
                    break;
                }
            }

            if (elapsed >= totalDuration) {
                clearInterval(interval);
                setTimeout(() => {
                    onClose?.();
                }, 1500);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <motion.div
                            animate={{
                                rotate: progress < 100 ? 360 : 0,
                                scale: progress === 100 ? [1, 1.2, 1] : 1
                            }}
                            transition={{
                                rotate: { duration: 2, repeat: progress < 100 ? Infinity : 0, ease: "linear" },
                                scale: { duration: 0.5 }
                            }}
                            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/30"
                        >
                            <span className="text-3xl sm:text-4xl">
                                {progress === 100 ? "🎉" : "🚀"}
                            </span>
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {progress === 100 ? "Deployment Successful!" : "Deploying Your Project"}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {projectName || "your-project"}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Progress
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="relative w-full h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                            />
                            <motion.div
                                animate={{ x: ["0%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: index <= currentStep ? 1 : 0.3,
                                    x: 0
                                }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                                    index === currentStep && progress < 100
                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/20"
                                        : index < currentStep
                                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20"
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                }`}
                            >
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xl sm:text-2xl shadow-inner">
                                    {index < currentStep ? (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-xl sm:text-2xl"
                                        >
                                            ✓
                                        </motion.span>
                                    ) : (
                                        step.icon
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm sm:text-base ${
                                        index === currentStep && progress < 100
                                            ? "text-indigo-700 dark:text-indigo-300"
                                            : index < currentStep
                                            ? "text-emerald-700 dark:text-emerald-300"
                                            : "text-gray-500 dark:text-gray-400"
                                    }`}>
                                        {step.label}
                                    </p>
                                </div>
                                {index === currentStep && progress < 100 && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                    </motion.div>
                                )}
                                {index < currentStep && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                    >
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Success Message */}
                    {progress === 100 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-300 dark:border-emerald-700 text-center"
                        >
                            <p className="text-emerald-700 dark:text-emerald-300 font-semibold mb-2 text-sm sm:text-base">
                                🎊 Your project is now live!
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                Redirecting to dashboard...
                            </p>
                        </motion.div>
                    )}

                    {/* Floating Particles Animation */}
                    {progress < 100 && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-20"
                                    initial={{
                                        x: Math.random() * 100 + "%",
                                        y: "100%"
                                    }}
                                    animate={{
                                        y: "-100%",
                                        x: Math.random() * 100 + "%"
                                    }}
                                    transition={{
                                        duration: Math.random() * 3 + 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                        ease: "linear"
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
