"use client";
import Toast from "@/components/Toast";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
export default function RegisterPage() {
  const [email, setEmail] = useState("");

  const [name, setName] = useState("");

  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirm) {
      showToast("Please fill out all fields.", "error");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      showToast("Passwords do not match.", "error");
      setLoading(false);
      return;
    }
    const tempSessionId = localStorage.getItem("launchly_session");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, tempSessionId }),
    });
    if (!res.ok) {
      const text = await res.text();
      showToast(text || "Registration failed.", "error");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      showToast("✅ Account created! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1300);
    }, 800);
  };
  return (
    <main className="elative flex min-h-[90vh] items-center justify-center px-6 font-poppins">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-[350px] w-[350px] rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute right-[10%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 p-8 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50"
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          Create account
        </h1>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-900 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="cursor-pointer mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </motion.button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <Link
            href="/login"
            className="ml-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign in
          </Link>
        </p>
      </motion.form>
    </main>
  );
}
