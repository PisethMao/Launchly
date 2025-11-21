"use client";

import { baseUrl } from "@/utils/urls";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        activeDeployments: 0,
    });

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admin/stats", {
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to fetch stats", await res.text());
                return;
            }

            setStats(await res.json());
        }

        load();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6 inline">
                    Admin Dashboard
                </h1>
                <button
                    type="button"
                    onClick={() => {
                        signOut({ callbackUrl: `${baseUrl}` });
                    }}
                    className="px-5 py-2.5 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-900 transition active:scale-95 mr-4 float-right"
                >
                    Logout
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-3xl mt-2">{stats.totalUsers}</p>
                </div>

                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Projects</h2>
                    <p className="text-3xl mt-2">{stats.totalProjects}</p>
                </div>

                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">
                        Active Deployments
                    </h2>
                    <p className="text-3xl mt-2">{stats.activeDeployments}</p>
                </div>
            </div>
        </div>
    );
}
