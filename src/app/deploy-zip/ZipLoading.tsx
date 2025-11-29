/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ZIP Deployment Loading Component
export function ZipDeploymentLoading({
  isOpen,
  projectName,
  fileName,
  fileSize,
  onClose,
}: {
  isOpen: any;
  projectName?: any;
  fileName?: any;
  fileSize?: any;
  onClose?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const speed = 2.0;

  const steps = [
    { icon: "📤", label: "Uploading ZIP file", duration: 3000 * speed },
    { icon: "🔍", label: "Scanning archive...", duration: 4000 * speed },
    { icon: "📦", label: "Extracting files", duration: 2000 * speed },
    { icon: "🔍", label: "Scanning extracted file...", duration: 3000 * speed },
    { icon: "⚙️", label: "Processing assets", duration: 2000 * speed },
    { icon: "🔨", label: "Building deployment", duration: 2500 * speed },
    { icon: "🚀", label: "Publishing to server", duration: 2000 * speed },
    { icon: "✅", label: "Deployment complete!", duration: 1000 * speed },
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

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

  const formatFileSize = (bytes: any) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

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
          className="w-full max-w-2xl rounded-3xl bg-linear-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-2 border-purple-200 dark:border-purple-700 p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.1) 35px, rgba(139, 92, 246, 0.1) 70px)`,
              }}
            ></div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              animate={{
                rotate: progress < 100 ? [0, 360] : 0,
                scale: progress === 100 ? [1, 1.3, 1] : 1,
              }}
              transition={{
                rotate: {
                  duration: 3,
                  repeat: progress < 100 ? Infinity : 0,
                  ease: "linear",
                },
                scale: { duration: 0.6 },
              }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-rose-500 mb-6 shadow-2xl shadow-purple-500/40"
            >
              <span className="text-5xl">{progress === 100 ? "🎉" : "📦"}</span>
            </motion.div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
              {progress === 100
                ? "Deployment Successful!"
                : "Deploying ZIP Project"}
            </h2>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {projectName || "your-project"}
              </p>
              {fileName && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="truncate max-w-xs">{fileName}</span>
                  {fileSize && (
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      ({formatFileSize(fileSize)})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar with Animation */}
          <div className="mb-8 relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full shadow-lg"
              />
              <motion.div
                animate={{ x: ["0%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 h-full w-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
          </div>

          {/* Steps */}
          <div
            className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2 relative z-10"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#a855f7 transparent",
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  index === currentStep && progress < 100
                    ? "border-purple-500 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg shadow-purple-500/20 scale-[1.02]"
                    : index < currentStep
                    ? "border-emerald-300 dark:border-emerald-700 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
                    : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                }`}
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg transition-all ${
                    index === currentStep && progress < 100
                      ? "bg-linear-to-br from-purple-400 to-pink-500 scale-110"
                      : index < currentStep
                      ? "bg-linear-to-br from-emerald-400 to-teal-500"
                      : "bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
                  }`}
                >
                  {index < currentStep ? (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-3xl"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold text-base ${
                      index === currentStep && progress < 100
                        ? "text-purple-700 dark:text-purple-300"
                        : index < currentStep
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index === currentStep && progress < 100 && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="shrink-0"
                  >
                    <svg
                      className="w-7 h-7 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </motion.div>
                )}
                {index < currentStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="shrink-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Success Message */}
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="p-5 rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-center relative overflow-hidden shadow-2xl z-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-6xl mb-3"
              >
                🎊
              </motion.div>
              <p className="text-white font-bold text-xl mb-2">
                Your ZIP project is now live!
              </p>
              <p className="text-white/90 text-sm">
                Redirecting to dashboard...
              </p>

              {/* Confetti Effect */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: [
                      "#fbbf24",
                      "#f87171",
                      "#60a5fa",
                      "#34d399",
                      "#a78bfa",
                    ][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: "50%",
                  }}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{
                    y: [0, -100, -200],
                    x: [
                      (Math.random() - 0.5) * 50,
                      (Math.random() - 0.5) * 150,
                    ],
                    opacity: [1, 1, 0],
                    rotate: [0, Math.random() * 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Floating ZIP Files Animation */}
          {progress < 100 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl opacity-10"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: "110%",
                  }}
                  animate={{
                    y: "-20%",
                    x: `${Math.random() * 100}%`,
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "linear",
                  }}
                >
                  📦
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
