"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [email, setEmail] = useState("demo@launchly.app");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [password, setPassword] = useState("demo123");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/user";
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const storedUser = localStorage.getItem("launchly_user");
    if (!storedUser) {
      setLoading(false);
      alert("⚠️ No account found. Please sign up first.");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.email === email && user.password === password) {
      localStorage.setItem("launchly_auth", "true");
      localStorage.setItem("launchly_current_user", JSON.stringify(user));
      setTimeout(() => {
        setLoading(false);
        window.location.href = callbackUrl;
      }, 600);
    } else {
      setLoading(false);
      alert("❌ Incorrect email or password.");
    }
  };
  return (
    <main className="font-poppins relative flex min-h-[90vh] items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[20%] h-[350px] w-[350px] rounded-full blur-3xl bg-indigo-500/20"></div>
        <div className="absolute right-[-10%] bottom-[20%] h-[350px] w-[350px] rounded-full blur-3xl bg-blue-400/20"></div>
      </div>
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        action=""
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 border rounded-2xl backdrop-blur-sm dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 p-8 shadow-xl"
      >
        <h1 className="text-3xl font-semibold text-center mb-6">Sign in</h1>
        <div className="space-y-4">
          <label htmlFor="" className="block text-sm mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-900 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="" className="block text-sm mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-900 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="cursor-pointer mt-2 w-full py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </motion.button>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          No account?{" "}
          <Link
            href="/register"
            className="ml-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Create one
          </Link>
        </p>
      </motion.form>
    </main>
  );
}
