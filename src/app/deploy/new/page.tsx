/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getOrCreateTempSessionClient } from "@/utils/session/client";
import { DeploymentLoading } from "./DeployLoading";

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
    const [showDeploymentLoading, setShowDeploymentLoading] = useState(false);

    // 🔑 token + modal state
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [personalToken, setPersonalToken] = useState("");
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isTokenSubmitting, setIsTokenSubmitting] = useState(false);
    const [agreePolicy, setAgreePolicy] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const id = getOrCreateTempSessionClient();
            setTempSessionId(id);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

  const router = useRouter();
  // ----------------------
  // FREE PLAN LIMIT CHECK
  // ----------------------
  useEffect(() => {
    async function checkLimit() {
      const res = await fetch("/api/deployments/list");
      const data = await res.json();

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

    checkLimit();
  }, [router]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

<<<<<<< HEAD
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
      showToast("Invalid repository URL. Expected a GitHub URL.", "error");
      return false;
    }
    if (provider === "gitlab" && !isGitLab) {
      showToast("Invalid repository URL. Expected a GitLab URL.", "error");
      return false;
    }
    return true;
  };

  const fetchBranches = async () => {
    setError(null);
    setSuccess(null);

    if (!validateRepositoryUrl()) return;
=======
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
                    setTokenError(
                        "Token rejected. Please check your token or scopes."
                    );
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
>>>>>>> origin/chanchhay-dev

    setLoading(true);

<<<<<<< HEAD
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoUrl,
        userToken,
      }),
    });
=======
        const branchSelect = document.querySelector(
            "#branch-select"
        ) as HTMLSelectElement;
        const branch = branchSelect?.value || selectedBranch || "main";
>>>>>>> origin/chanchhay-dev

    const data = await res.json();
    setLoading(false);

<<<<<<< HEAD
    if (data.private === true) {
      setIsPrivateRepo(true);
      showToast(
        "🔒 This is a PRIVATE repository. Please enter a Personal Access Token.",
        "warning"
      );
      setBranches([]);
      return;
    }

    setIsPrivateRepo(false);
    setBranches(data.branches || []);

    if (data.branches?.length > 0) {
      setSelectedBranch(data.branches[0]);
      setSuccess(`✅ ${data.branches.length} branches found.`);
    } else {
      showToast("No branches found.", "error");
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

    const branch = selectedBranch;

    showToast(
      `🚀 Deployment started\n\nProvider: ${provider}\nProject: ${projectName}\nBranch: ${branch}\nRepository: ${repoUrl}`,
      "success"
=======
        setShowDeploymentLoading(true);
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
            } else {
                showToast(`⚠️ Deployment failed: ${data.error}`, "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Deployment failed due to an unexpected error.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
            <div className="max-w-5xl mx-auto px-6 py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/30">
                        <svg
                            className="w-8 h-8 text-white"
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
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                        New Deployment
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Deploy your project in seconds with our seamless
                        pipeline
                    </p>
                </motion.div>

                {/* Toast Notifications */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className="fixed top-6 right-6 z-50 max-w-md"
                        >
                            <div
                                className={`rounded-2xl shadow-2xl p-4 backdrop-blur-lg border ${
                                    toast.type === "success"
                                        ? "bg-emerald-500/90 border-emerald-400 text-white"
                                        : toast.type === "error"
                                        ? "bg-rose-500/90 border-rose-400 text-white"
                                        : "bg-amber-500/90 border-amber-400 text-white"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        {toast.type === "success" && (
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                        {toast.type === "error" && (
                                            <svg
                                                className="w-6 h-6"
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
                                        )}
                                        {toast.type === "warning" && (
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium whitespace-pre-line">
                                            {toast.message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setToast(null)}
                                        className="flex-shrink-0 hover:opacity-70"
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
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-10"
                >
                    {/* Provider Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Select Repository Provider{" "}
                            <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setProvider("github")}
                                className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 ${
                                    provider === "github"
                                        ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 shadow-lg shadow-indigo-500/20"
                                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-indigo-300 hover:shadow-md"
                                }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-lg">
                                        <svg
                                            className="w-10 h-10 text-white dark:text-gray-900"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                        GitHub
                                    </span>
                                    {provider === "github" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                                        >
                                            <svg
                                                className="w-4 h-4 text-white"
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
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setProvider("gitlab")}
                                className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 ${
                                    provider === "gitlab"
                                        ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 shadow-lg shadow-orange-500/20"
                                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-orange-300 hover:shadow-md"
                                }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-xl  from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                                        <Image
                                            src="/gitlab.png"
                                            width={50}
                                            height={50}
                                            className="mb-2"
                                            alt="GitLab Image"
                                        />
                                    </div>
                                    <span className="text-base font-semibold text-orange-600 dark:text-orange-400">
                                        GitLab
                                    </span>
                                    {provider === "gitlab" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
                                        >
                                            <svg
                                                className="w-4 h-4 text-white"
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
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Repository URL */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Repository URL{" "}
                            <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                placeholder="https://github.com/username/repository"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Fetch Branches Button */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={fetchBranches}
                        disabled={!repoUrl || loading}
                        className="w-full mb-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin w-5 h-5"
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
                                Fetching Branches...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
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
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                </svg>
                                Fetch Branches
                            </span>
                        )}
                    </motion.button>

                    {/* Branch Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Branch <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="branch-select"
                                disabled={branches.length === 0}
                                value={selectedBranch}
                                onChange={(e) =>
                                    setSelectedBranch(e.target.value)
                                }
                                className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {branches.length === 0 ? (
                                    <option>
                                        Click "Fetch Branches" first...
                                    </option>
                                ) : (
                                    branches.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))
                                )}
                            </select>
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                />
                            </svg>
                            <svg
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>

                        {/* Status Messages */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-3 text-sm text-rose-500 flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 rounded-lg"
                                >
                                    <svg
                                        className="w-5 h-5 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {error}
                                </motion.p>
                            )}
                            {success && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-lg"
                                >
                                    <svg
                                        className="w-5 h-5 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {success}
                                </motion.p>
                            )}
                            {!error && !success && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
                                >
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
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Enter repository URL and fetch branches to
                                    continue
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Project Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Project Name{" "}
                            <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="my-awesome-project"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Policy Agreement */}
                    <div className="mb-8">
                        <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={agreePolicy}
                                onChange={(e) =>
                                    setAgreePolicy(e.target.checked)
                                }
                                className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                I agree to the{" "}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        showToast(
                                            "Policy:\n\nPlease ensure your deployment follows company guidelines and security policies.\nProject must include 'index.html' file.",
                                            "warning"
                                        );
                                    }}
                                    className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    deployment policy
                                </button>
                            </span>
                        </label>
                    </div>

                    {/* Deploy Button */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={handleDeploy}
                        disabled={
                            !repoUrl || !projectName || !agreePolicy || loading
                        }
                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300"
                    >
                        <span className="flex items-center justify-center gap-3">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                            </svg>
                            Deploy Now
                        </span>
                    </motion.button>
                </motion.div>

                {/* Token Modal */}
                <AnimatePresence>
                    {showTokenModal && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-8 shadow-2xl"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                        <svg
                                            className="w-7 h-7 text-white"
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
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            Private Repository Detected
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            This repository requires
                                            authentication
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">
                                        <span className="font-semibold">
                                            🔒 Privacy Notice:
                                        </span>{" "}
                                        We do not store your token. It's used
                                        only for this operation and transmitted
                                        securely.
                                    </p>
                                </div>

                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Personal Access Token{" "}
                                    <span className="text-rose-500">*</span>
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
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none mb-2"
                                />

                                {tokenError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg mb-4"
                                    >
                                        {tokenError}
                                    </motion.p>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowTokenModal(false);
                                            setPersonalToken("");
                                            setTokenError(null);
                                        }}
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isTokenSubmitting}
                                        onClick={handleTokenSubmit}
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all"
                                    >
                                        {isTokenSubmitting
                                            ? "Verifying..."
                                            : "Use Token"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <DeploymentLoading
                    isOpen={showDeploymentLoading}
                    projectName={projectName}
                    onClose={() => {
                        setShowDeploymentLoading(false);
                        router.push("/user");
                    }}
                />
            </div>
        </div>
>>>>>>> origin/chanchhay-dev
    );

    setLoading(true);
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoUrl,
        subdomain: projectName,
        branch,
        tempSessionId,
        personalToken: userToken,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setSuccess(`✅ Deployment started. Job ID: ${data.jobId}`);
      setTimeout(() => router.push("/user"), 1500);
    } else {
      showToast(`⚠️ Deployment failed: ${data.error}`, "error");
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
          New Deployment
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Enter your <span className="text-indigo-600 font-medium">PUBLIC</span>{" "}
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
            onClick={() => {
              setProvider("github");
              setIsPrivateRepo(false);
              setUserToken("");
            }}
            className={`flex flex-col items-center justify-center rounded-lg py-4 transition cursor-pointer hover:shadow hover:border-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black dark:focus:ring-black ${
              provider === "github"
                ? "dark:bg-indigo-900/30"
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
            onClick={() => {
              setProvider("gitlab");
              setIsPrivateRepo(false);
              setUserToken("");
            }}
            className={`flex flex-col items-center justify-center rounded-lg py-4 transition cursor-pointer hover:shadow hover:border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 ${
              provider === "gitlab"
                ? "dark:bg-indigo-900/30"
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

            <span className="text-sm font-medium text-orange-500">GitLab</span>
          </button>
        </div>
      </motion.div>
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
      {isPrivateRepo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <label className="font-medium text-sm">
            Personal Access Token (required for private repo)
            <span className="text-red-500"> *</span>
          </label>
          <input
            type="password"
            value={userToken}
            onChange={(e) => setUserToken(e.target.value)}
            placeholder="Your Personal Access Token"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
          />
        </motion.div>
      )}
      <button
        type="button"
        onClick={fetchBranches}
        disabled={!repoUrl || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Fetching branches..." : "Fetch Branches"}
      </button>
      <div className="mt-8">
        <label htmlFor="" className="font-medium text-sm">
          Branch <span className="text-red-500">*</span>
        </label>
        {branches.length === 0 && (
          <select
            name=""
            id=""
            disabled
            className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg mt-1 text-gray-500 cursor-not-allowed"
          >
            <option>Click &quot;Fetch Branches&quot; first...</option>
          </select>
        )}
        {branches.length > 0 && (
          <select
            name=""
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
            Enter repository URL and click &quot;Fetch Branches&quot;
          </p>
        )}
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
        <button
          type="button"
          onClick={handleDeploy}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Deploy Now
        </button>
      </div>
    </div>
  );
}
