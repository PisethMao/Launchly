/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function UserProject() {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        async function loadProjects() {
            const res = await fetch("/api/admin/projects", {
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to fetch projects", await res.text());
                setProjects([]);
                return;
            }

            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        }

        loadProjects();
    }, []);

    async function handleDelete(id: number, subdomain: string) {
        const ok = confirm(
            `Delete project "${subdomain}"? This will stop PM2, delete files, DNS, and DB record.`
        );
        if (!ok) return;

        const res = await fetch(`/api/admin/projects/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Failed to delete project");
            console.error(await res.text());
            return;
        }

        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Projects Management</h1>

            <table className="w-full bg-white shadow rounded">
                <thead className="border-b">
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Subdomain</th>
                        <th className="p-3 text-left">Owner</th>
                        <th className="p-3 text-left">Project Type</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {projects.map((p: any) => (
                        <tr key={p.id} className="border-b">
                            <td className="p-3">{p.id}</td>
                            <td className="p-3">{p.subdomain}</td>
                            <td className="p-3">
                                {p.user?.email || "Unknown"}
                            </td>
                            <td className="p-3">{p.projectType}</td>
                            <td className="p-3">{p.status}</td>
                            <td className="p-3">
                                <button
                                    onClick={() =>
                                        handleDelete(p.id, p.subdomain)
                                    }
                                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
