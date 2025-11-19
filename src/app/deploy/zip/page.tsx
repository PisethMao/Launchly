"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Toast from "@/components/Toast";

export default function ZipDeployPage() {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleDeploy = async () => {
    if (!file || !projectName) {
      showToast("Please provide a project name and ZIP file.", "error");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("projectName", projectName);
      formData.append("file", file);
      const res = await fetch("/api/deploy-zip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(`❌ Deployment failed: ${data.error}`, "error");
      } else {
        showToast(`🎉 Deployment started!\nJob ID: ${data.jobId}`, "success");
        setTimeout(() => {
          window.location.href = "/user";
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Something went wrong", "error");
    }
    setLoading(false);
  };
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-poppins">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-semibold">Deploy ZIP File</h1>
        <p className="text-sm mt-2">
          Upload your ZIP file and deploy it quickly!
        </p>
      </motion.header>
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
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-full max-w-md">
          <label htmlFor="projectName" className="block text-sm font-medium">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            className="mt-2 w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div className="mt-6 w-full max-w-md">
          <label htmlFor="" className="block text-sm font-medium">
            Upload ZIP File
          </label>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="mt-2 w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className={`mt-8 px-6 py-3 text-white text-lg rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
            loading ? "bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          onClick={handleDeploy}
        >
          {loading ? "Deploying..." : "Deploy Now"}
        </motion.button>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center text-gray-800 dark:text-white"
          >
            <p>{message}</p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
