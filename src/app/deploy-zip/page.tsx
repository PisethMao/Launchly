"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { getOrCreateTempSessionClient } from "@/utils/session/client";
import { ZipDeploymentLoading } from "./ZipLoading";

export default function NewZipDeploymentPage() {
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const [tempSessionId, setTempSessionId] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [agreePolicy, setAgreePolicy] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showZipDeploymentLoading, setShowZipDeploymentLoading] =
        useState(false);
    const [fileName, setFileName] = useState("project-files.zip");

    useEffect(() => {
        const timer = setTimeout(() => {
            const id = getOrCreateTempSessionClient();
            setTempSessionId(id);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const router = useRouter();
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "warning";
    } | null>(null);

    const showToast = (
        message: string,
        type: "success" | "error" | "warning"
    ) => {
        setToast({ message, type });
    };

    const validateZipFile = (file: File) => {
        const validTypes = ["application/zip", "application/x-zip-compressed"];
        const maxSize = 100 * 1024 * 1024; // 100MB

        if (!validTypes.includes(file.type) && !file.name.endsWith(".zip")) {
            showToast("Please upload a valid ZIP file.", "error");
            return false;
        }

        if (file.size > maxSize) {
            showToast("File size must be less than 100MB.", "error");
            return false;
        }

        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateZipFile(file)) {
            setZipFile(file);
            setSuccess(
                `✅ File "${file.name}" loaded (${(
                    file.size /
                    1024 /
                    1024
                ).toFixed(2)} MB)`
            );
            setError(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && validateZipFile(file)) {
            setZipFile(file);
            setSuccess(
                `✅ File "${file.name}" loaded (${(
                    file.size /
                    1024 /
                    1024
                ).toFixed(2)} MB)`
            );
            setError(null);
        }
    };

    const removeFile = () => {
        setZipFile(null);
        setSuccess(null);
        setError(null);
    };

    const handleDeploy = async () => {
        if (!zipFile || !projectName) {
            showToast("Please fill in all required fields.", "error");
            return;
        }
        if (!agreePolicy) {
            showToast("Please agree to the policy to continue.", "error");
            return;
        }
        if (!tempSessionId) {
            showToast("Session not ready yet. Please wait a moment.", "error");
            return;
        }

        showToast(
            `🚀 Deployment started\n\nProject: ${projectName}\nFile: ${
                zipFile.name
            }\nSize: ${(zipFile.size / 1024 / 1024).toFixed(2)} MB`,
            "success"
        );

        setShowZipDeploymentLoading(true);

        setLoading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        const formData = new FormData();
        formData.append("file", zipFile);
        formData.append("subdomain", projectName);
        formData.append("tempSessionId", tempSessionId);

        const res = await fetch("/api/deploy-zip", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (res.ok) {
            showToast("ZIP uploaded and verified!", "success");
        } else {
            showToast(`⚠️ Deployment failed: ${data.message}`, "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-950 dark:via-indigo-950/20 dark:to-purple-950/10">
            <div className="max-w-5xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M13 7H7v6h6V7z" />
                            <path
                                fillRule="evenodd"
                                d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        ZIP Deployment
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
                        Deploy Your Project
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Upload a ZIP file containing your static website and
                        deploy it instantly to the cloud
                    </p>
                </motion.div>

                <AnimatePresence>
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 p-8 mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
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
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Upload ZIP File
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Drag and drop or click to browse
                            </p>
                        </div>
                    </div>

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                            dragActive
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]"
                                : zipFile
                                ? "border-green-400 bg-green-50/50 dark:bg-green-900/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                        }`}
                    >
                        <input
                            type="file"
                            accept=".zip,application/zip"
                            onChange={handleFileChange}
                            className="hidden"
                            id="zip-upload"
                        />

                        {!zipFile ? (
                            <label
                                htmlFor="zip-upload"
                                className="cursor-pointer block"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
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
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            <span className="text-indigo-600 dark:text-indigo-400">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            ZIP files only • Maximum 100MB
                                        </p>
                                    </div>
                                </motion.div>
                            </label>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate max-w-md">
                                            {zipFile.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {(
                                                zipFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="ml-4 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {success && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {success}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 p-8 mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Project Configuration
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Set up your deployment details
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="my-awesome-project"
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9-]/g, "")
                                )
                            }
                            className="w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                        />
                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg px-4 py-2 border border-indigo-200 dark:border-indigo-800">
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                                        {projectName || "your-project"}
                                    </span>
                                    <span className="text-gray-500">
                                        .yourdomain.com
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 p-8"
                >
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={agreePolicy}
                            onChange={(e) => setAgreePolicy(e.target.checked)}
                            className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                            I agree to the{" "}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    showToast(
                                        `Deployment Policy:\n\n✓ Follow company guidelines and security policies\n✓ ZIP must include "index.html" at root level\n✓ Maximum file size: 100MB\n✓ Only static content allowed\n✓ No malicious code or content`,
                                        "warning"
                                    );
                                }}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline font-medium transition-colors"
                            >
                                Deployment Policy
                            </button>
                        </span>
                    </label>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-6"
                        >
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>Uploading...</span>
                                <span className="font-semibold">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}

                    <button
                        type="button"
                        onClick={handleDeploy}
                        disabled={
                            loading || !zipFile || !projectName || !agreePolicy
                        }
                        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:shadow-none flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
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
                                Deploying...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                Deploy Now
                            </>
                        )}
                    </button>
                </motion.div>

                <ZipDeploymentLoading
                    isOpen={showZipDeploymentLoading}
                    projectName={projectName}
                    fileName={fileName}
                    fileSize={zipFile ? zipFile.size : 0}
                    onClose={() => {
                        setShowZipDeploymentLoading(false);
                        setTimeout(() => {
                            router.push("/user");
                        }, 3000);
                    }}
                />
            </div>
        </div>
    );
}
