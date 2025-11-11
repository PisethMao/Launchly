"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NewDeploymentPage() {
    const [repoUrl, setRepoUrl] = useState("");
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("main");
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<"github" | "gitlab" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const router = useRouter();
    const validateRepositoryUrl = () => {
        if (!provider) {
            setError("Please select a repository provider.");
            return;
        }
        const isGitHub = repoUrl.includes("github.com");
        const isGitLab = repoUrl.includes("gitlab.com");
        if (provider === "github" && !isGitHub) {
            setError("Invalid repository URL format. Expected a GitHub URL.");
            return false;
        }
        if (provider === "gitlab" && !isGitLab) {
            setError("Invalid repository URL format. Expected a GitLab URL.");
            return false;
        }
        setError(null);
        return true;
    };
    const fetchBranches = async () => {
        setSuccess(null);
        if (!validateRepositoryUrl()) {
            return;
        }
        setLoading(true);
        const res = await fetch("/api/branches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repoUrl }),
        });
        const data = await res.json();
        setBranches(data.branches);
        if (data.branches && data.branches.length > 0) setSelectedBranch(data.branches[0]);
        setLoading(false);
        if (data.branches && data.branches.length > 0) {
            const count = data.branches.length;
            setSuccess(
                `✅ ${count} ${count === 1 ? "branch" : "branches"} found.`
            );
            setError(null);
        } else {
            setError("No branches found in this repository.");
            setSuccess(null);
        }
    };
    const handleDeploy = async () => {
        // Validate
        if (!repoUrl || !projectName) {
            setError("Please fill in all required fields.");
            return;
        }
        setError(null);
        setSuccess(null);
        setLoading(true);

        const branch = selectedBranch || "main";

        // Informational success message instead of alert
        setSuccess(`🚀 Deployment started — ${projectName} (${branch})`);

        const res = await fetch("/api/deploy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repoUrl, subdomain: projectName, branch }),
        });
        const data = await res.json();
        if (res.ok) {
            setSuccess(`✅ Deployment started. Job ID: ${data.jobId}`);
            setError(null);

            // Route user appropriately: if authenticated go to /user, otherwise to /login
            const isAuth = !!localStorage.getItem("launchly_auth");
            setTimeout(() => {
                setSuccess(null);
                if (isAuth) router.push("/user");
                else router.push(`/login?next=/user`);
            }, 800);
        } else {
            setError("⚠️ Deployment failed: " + (data.error || "Unknown error"));
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
                    Enter your{" "}
                    <span className="text-indigo-600 font-medium">PUBLIC</span>{" "}
                    repository details to deploy
                </p>
            </motion.div>
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
                        onClick={() => setProvider("gitlab")}
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
                        <span className="text-sm font-medium text-orange-500">
                            GitLab
                        </span>
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
            />
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
                        <option>
                            Click &quot;Fetch Branches&quot; first...
                        </option>
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
                        Enter repository URL and click &quot;Fetch
                        Branches&quot;
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
                                alert(
                                    `Policy:\n\nPlease ensure your deployment follows company guidelines and security policies.\nProject must include "index.html" file.`
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
