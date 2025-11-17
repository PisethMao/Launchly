/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
