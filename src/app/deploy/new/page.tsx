"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { getOrCreateTempSessionClient } from "@/utils/session/client";
// import { Link } from "lucide-react"; // currently unused

export default function NewDeploymentPage() {
    const [repoUrl, setRepoUrl] = useState("");
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("main");
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<"github" | "gitlab" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const [tempSessionId, setTempSessionId] = useState<string | null>(null);

    // 🔑 token + modal state
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [personalToken, setPersonalToken] = useState("");
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isTokenSubmitting, setIsTokenSubmitting] = useState(false);

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

    const validateRepositoryUrl = () => {
        if (!provider) {
            showToast("Please select a repository provider.", "error");
            return false;
        }
        const isGitHub = repoUrl.includes("github.com");
        const isGitLab = repoUrl.includes("gitlab.com");

        if (provider === "github" && !isGitHub) {
            showToast(
                "Invalid repository URL. Expected a GitHub URL.",
                "error"
            );
            return false;
        }
        if (provider === "gitlab" && !isGitLab) {
            showToast(
                "Invalid repository URL. Expected a GitLab URL.",
                "error"
            );
            return false;
        }
        return true;
    };

    // 🔁 core function used both for normal + token-based branch fetch
    const fetchBranchesInternal = async (token?: string) => {
        setSuccess(null);
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoUrl,
                    personalToken: token || null, // backend can decide if needed
                }),
            });

            const data = await res.json();

            // 🛡️ backend can signal private repo in different ways.
            // You can choose:
            // - status 401/403
            // - data.private === true
            // - data.error === "PRIVATE_REPO"
            if (
                res.status === 401 ||
                res.status === 403 ||
                data.private === true ||
                data.error === "PRIVATE_REPO"
            ) {
                // show modal & ask token
                setShowTokenModal(true);
                setLoading(false);

                if (!token) {
                    // first time detection
                    showToast(
                        "This repository appears to be private. Please provide an access token.",
                        "warning"
                    );
                } else {
                    // token provided but still unauthorized
                    setTokenError("Token rejected. Please check your token or scopes.");
                }
                return;
            }

            if (!res.ok) {
                setError(data.error || "Failed to fetch branches.");
                setBranches([]);
                setLoading(false);
                return;
            }

            const branchList = data.branches || [];
            setBranches(branchList);

            if (branchList.length > 0) {
                const count = branchList.length;
                setSuccess(
                    `✅ ${count} ${count === 1 ? "branch" : "branches"} found.`
                );
            } else {
                setError("No branches found in this repository.");
                setBranches([]);
            }
        } catch (err) {
            console.error(err);
            setError("Unexpected error while fetching branches.");
            setBranches([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        if (!validateRepositoryUrl()) return;
        // first attempt: no token
        await fetchBranchesInternal();
    };

    // 🔑 called from modal when user submits token
    const handleTokenSubmit = async () => {
        if (!personalToken.trim()) {
            setTokenError("Token is required for private repositories.");
            return;
        }
        setTokenError(null);
        setIsTokenSubmitting(true);

        await fetchBranchesInternal(personalToken.trim());

        setIsTokenSubmitting(false);

        // If branches were successfully loaded, close modal
        if (branches.length > 0 && !error) {
            setShowTokenModal(false);
            showToast("Branches loaded using your token.", "success");
        }
    };

    const handleDeploy = async () => {
        if (!repoUrl || !projectName) {
            showToast("Please fill in all required fields.", "error");
            return;
        }
        if (!tempSessionId) {
            showToast("Session not ready yet. Please wait a moment.", "error");
            return;
        }

        const branchSelect = document.querySelector(
            "#branch-select"
        ) as HTMLSelectElement;
        const branch = branchSelect?.value || selectedBranch || "main";

        showToast(
            `🚀 Deployment started\n\nProvider: ${provider}\nProject: ${projectName}\nBranch: ${branch}\nRepository: ${repoUrl}`,
            "success"
        );

        setLoading(true);
        try {
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoUrl,
                    subdomain: projectName,
                    branch,
                    tempSessionId,
                    personalToken: personalToken || null, // used only if needed
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(`✅ Deployment started. Job ID: ${data.jobId}`);
                setTimeout(() => router.push("/user"), 3000);
            } else {
                showToast(`⚠️ Deployment failed: ${data.error}`, "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Deployment failed due to an unexpected error.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 font-poppins">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-semibold tracking-tight">
                    New Deployment
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Enter your{" "}
                    <span className="text-indigo-600 font-medium">PUBLIC</span>{" "}
                    repository details to deploy
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

            {/* Provider selection card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition mb-8"
            >
                <label className="text-sm font-medium">
                    Repository Provider <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    <button
                        type="button"
                        onClick={() => setProvider("github")}
                        className={`flex flex-col items-center justify-center rounded-lg py-4 border transition cursor-pointer hover:shadow hover:border-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black dark:focus:ring-black ${
                            provider === "github"
                                ? "dark:bg-indigo-900/30 border-indigo-500"
                                : "border-gray-300 dark:border-gray-600"
                        }`}
                    >
                        <Image
                            src="/github.svg"
                            width={40}
                            height={40}
                            className="mb-2"
                            alt="GitHub Image"
                        />
                        <span className="text-sm font-medium">GitHub</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setProvider("gitlab")}
                        className={`flex flex-col items-center justify-center rounded-lg py-4 border transition cursor-pointer hover:shadow hover:border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 ${
                            provider === "gitlab"
                                ? "dark:bg-indigo-900/30 border-orange-500"
                                : "border-gray-300 dark:border-gray-600"
                        }`}
                    >
                        <Image
                            src="/gitlab.png"
                            width={40}
                            height={40}
                            className="mb-2"
                            alt="GitLab Image"
                        />
                        <span className="text-sm font-medium text-orange-500">
                            GitLab
                        </span>
                    </button>
                </div>
            </motion.div>

            {/* Repo URL + Fetch branches */}
            <label htmlFor="" className="font-medium text-sm">
                Repository URL <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                required
            />
            <button
                type="button"
                onClick={fetchBranches}
                disabled={!repoUrl || loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
            >
                {loading ? "Fetching branches..." : "Fetch Branches"}
            </button>

            {/* Branch select */}
            <div className="mt-8">
                <label htmlFor="" className="font-medium text-sm">
                    Branch <span className="text-red-500">*</span>
                </label>
                {branches.length === 0 && (
                    <select
                        disabled
                        className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg mt-1 text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
                    >
                        <option>
                            Click &quot;Fetch Branches&quot; first...
                        </option>
                    </select>
                )}
                {branches.length > 0 && (
                    <select
                        id="branch-select"
                        className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        {branches.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                )}

                {error ? (
                    <p className="mt-2 text-sm text-orange-500 flex items-center gap-1">
                        ⚠️ {error}
                    </p>
                ) : success ? (
                    <p className="mt-2 text-sm text-emerald-500 flex items-center gap-1">
                        {success}
                    </p>
                ) : (
                    <p className="mt-2 text-sm text-gray-400">
                        Enter repository URL and click &quot;Fetch
                        Branches&quot;
                    </p>
                )}

                {/* Project name */}
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
                </div>

                {/* Policy checkbox */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>
                        I agree to the{" "}
                        <button
                            type="button"
                            onClick={() =>
                                showToast(
                                    `Policy:\n\nPlease ensure your deployment follows company guidelines and security policies.\nProject must include "index.html" file.`,
                                    "warning"
                                )
                            }
                            className="text-indigo-400 underline hover:text-indigo-300 cursor-pointer"
                        >
                            Policy
                        </button>
                    </span>
                </div>

                {/* Deploy button */}
                <button
                    type="button"
                    onClick={handleDeploy}
                    className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                    Deploy Now
                </button>
            </div>

            {/* 🔒 Token Modal */}
            <AnimatePresence>
                {showTokenModal && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-2xl relative"
                        >
                            <h2 className="text-lg font-semibold mb-2">
                                Private Repository Detected
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                This repository appears to be private. Enter a{" "}
                                <span className="font-medium">
                                    personal access token
                                </span>{" "}
                                with read access. We{" "}
                                <span className="font-semibold">
                                    do not store
                                </span>{" "}
                                your token; it&apos;s used only for this
                                operation.
                            </p>

                            <label className="block text-sm font-medium mb-1">
                                Personal Access Token
                            </label>
                            <input
                                type="password"
                                value={personalToken}
                                onChange={(e) => {
                                    setPersonalToken(e.target.value);
                                    setTokenError(null);
                                }}
                                placeholder={
                                    provider === "github"
                                        ? "ghp_xxxxxxxxxxxxxxxxx"
                                        : "glpat-xxxxxxxxxxxxxxxx"
                                }
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 mb-2"
                            />

                            {tokenError && (
                                <p className="text-xs text-red-500 mb-2">
                                    {tokenError}
                                </p>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => {
                                        setShowTokenModal(false);
                                        setPersonalToken("");
                                        setTokenError(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isTokenSubmitting}
                                    className="px-4 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                                    onClick={handleTokenSubmit}
                                >
                                    {isTokenSubmitting
                                        ? "Checking..."
                                        : "Use Token"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
