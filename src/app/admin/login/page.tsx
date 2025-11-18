/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: any) {
        e.preventDefault();

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            window.location.href = "/admin/dashboard";
        } else {
            alert("Invalid admin credentials");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 shadow-lg w-96 rounded"
            >
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Admin Login
                </h1>

                <input
                    className="w-full border p-2 mb-3 rounded"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full border p-2 mb-3 rounded"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="w-full bg-black text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
