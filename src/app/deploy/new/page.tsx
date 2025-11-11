"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [repoUrl, setRepoUrl] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [branches, setBranches] = useState<string[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [provider, setProvider] = useState<"github" | "gitlab" | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [success, setSuccess] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [projectName, setProjectName] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    setSuccess(null);
    if (!validateRepositoryUrl()) return;

    setLoading(true);
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl }),
    });
    const data = await res.json();

    setBranches(data.branches || []);
    setLoading(false);

    if (data.branches?.length > 0) {
      const count = data.branches.length;
      setSuccess(`✅ ${count} ${count === 1 ? "branch" : "branches"} found.`);
      setError(null);
    } else {
      showToast("No branches found in this repository.", "error");
    }
  };

  const handleDeploy = async () => {
    if (!repoUrl || !projectName) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const branchSelect = document.querySelector("select") as HTMLSelectElement;
    const branch = branchSelect?.value || "main";

    showToast(
      `🚀 Deployment started\n\nProvider: ${provider}\nProject: ${projectName}\nBranch: ${branch}\nRepository: ${repoUrl}`,
      "success"
    );

    setLoading(true);
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, branch, projectName }),
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
