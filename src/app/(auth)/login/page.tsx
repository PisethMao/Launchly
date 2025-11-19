"use client";

import Toast from "@/components/Toast";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [email, setEmail] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [password, setPassword] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useSearchParams();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const callbackUrl = params.get("callbackUrl") ?? "/user";
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const resAdmin = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        if (resAdmin.ok) {
            window.location.href = "/admin/dashboard";
        } else {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            setLoading(false);
            if (res?.error) {
                showToast("❌ Incorrect email or password.", "error");
                return;
            }
            showToast("✅ Welcome back!", "success");
            setTimeout(() => {
                router.push(callbackUrl);
            }, 900);
        }
    };
    return (
        <main className="font-poppins relative flex min-h-[90vh] items-center justify-center px-6">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-10%] top-[20%] h-[350px] w-[350px] rounded-full blur-3xl bg-indigo-500/20"></div>
                <div className="absolute right-[-10%] bottom-[20%] h-[350px] w-[350px] rounded-full blur-3xl bg-blue-400/20"></div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <motion.form
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                action=""
                onSubmit={handleLogin}
                className="w-full max-w-md space-y-4 border rounded-2xl backdrop-blur-sm dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 p-8 shadow-xl"
            >
                <h1 className="text-3xl font-semibold text-center mb-6">
                    Sign in
                </h1>
                <div className="space-y-4">
                    <label
                        htmlFor=""
                        className="block text-sm mb-1 font-medium"
                    >
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
                    <label
                        htmlFor=""
                        className="block text-sm mb-1 font-medium"
                    >
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
