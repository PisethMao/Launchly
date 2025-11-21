/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function ManageUser() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        async function loadUsers() {
            const res = await fetch("/api/admin/users", {
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to load users", await res.text());
                setUsers([]);
                return;
            }

            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        }

        loadUsers();
    }, []);

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const res = await fetch(`/api/admin/users/${id}/delete`, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Failed to delete user");
            return;
        }

        // Refresh UI (remove from list locally)
        setUsers(users.filter((u) => u.id !== id));
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users Management</h1>

            <div className="flex justify-end mb-4">
                <a
                    href="/admin/users/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create User
                </a>
            </div>

            <table className="w-full bg-white shadow rounded">
                <thead className="border-b">
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Plan</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.id} className="border-b">
                            <td className="p-3">{u.id}</td>
                            <td className="p-3">{u.name}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3">{u.plan}</td>
                            <td className="p-3">{u.role}</td>
                            <td className="p-3">
                                <a
                                    href={`/admin/users/${u.id}/edit`}
                                    className="text-blue-600 underline"
                                >
                                    Edit
                                </a>
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
