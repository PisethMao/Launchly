"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { getOrCreateTempSessionClient } from "@/utils/session/client";

export default function NewZipDeploymentPage() {
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const [tempSessionId, setTempSessionId] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

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
            setSuccess(`✅ File "${file.name}" loaded (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
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
            setSuccess(`✅ File "${file.name}" loaded (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            setError(null);
        }
    };

    const handleDeploy = async () => {
        if (!zipFile || !projectName) {
            showToast("Please fill in all required fields.", "error");
            return;
        }
        if (!tempSessionId) {
            showToast("Session not ready yet. Please wait a moment.", "error");
            return;
        }

        showToast(
            `🚀 Deployment started\n\nProject: ${projectName}\nFile: ${zipFile.name}\nSize: ${(zipFile.size / 1024 / 1024).toFixed(2)} MB`,
            "success"
        );

        setLoading(true);

        const formData = new FormData();
        formData.append("file", zipFile);
        formData.append("subdomain", projectName);
        formData.append("tempSessionId", tempSessionId);

        const res = await fetch("/api/deploy-zip", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        if (res.ok) {
            showToast("ZIP uploaded and verified!", "success");
            setTimeout(() => router.push("/user"), 1500);
        } else {
            showToast(`⚠️ Deployment failed: ${data.message}`, "error");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 font-poppins">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-semibold tracking-tight">
                    New ZIP Deployment
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Upload a{" "}
                    <span className="text-indigo-600 font-medium">ZIP file</span>{" "}
                    containing your project to deploy
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
                className="rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition mb-8"
            >
                <label className="text-sm font-medium">
                    Upload ZIP File <span className="text-red-500">*</span>
                </label>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`mt-3 border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                        dragActive
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                    }`}
                >
                    <input
                        type="file"
                        accept=".zip,application/zip"
                        onChange={handleFileChange}
                        className="hidden"
                        id="zip-upload"
                    />
                    <label htmlFor="zip-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                            <svg
                                className="w-12 h-12 text-gray-400"
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {zipFile ? (
                                    <span className="font-medium text-indigo-600">
                                        {zipFile.name}
                                    </span>
                                ) : (
                                    <>
                                        <span className="font-medium text-indigo-600">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </>
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                ZIP files only (Max 100MB)
                            </p>
                        </div>
                    </label>
                </div>

                {error && (
                    <p className="mt-2 text-sm text-orange-500 flex items-center gap-1">
                        ⚠️ {error}
                    </p>
                )}
                {success && (
                    <p className="mt-2 text-sm text-emerald-500 flex items-center gap-1">
                        {success}
                    </p>
                )}
            </motion.div>

            <div className="mt-6">
                <label className="block text-sm font-medium mb-1">
                    Project Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="my-project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Your project will be available at: {projectName || "your-project"}.yourdomain.com
                </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" className="w-4 h-4" />
                <span>
                    I agree to the{" "}
                    <button
                        type="button"
                        onClick={() =>
                            showToast(
                                `Policy:\n\nPlease ensure your deployment follows company guidelines and security policies.\nZIP must include "index.html" file at the root level.\nMax file size: 100MB.`,
                                "warning"
                            )
                        }
                        className="text-indigo-400 underline hover:text-indigo-300 cursor-pointer"
                    >
                        Policy
                    </button>
                </span>
            </div>

            <button
                type="button"
                onClick={handleDeploy}
                disabled={loading || !zipFile || !projectName}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Deploying..." : "Deploy Now"}
            </button>
        </div>
    );
}
