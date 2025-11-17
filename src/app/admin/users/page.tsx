/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users Management</h1>

            <table className="w-full bg-white shadow rounded">
                <thead className="border-b">
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Plan</th>
                        <th className="p-3 text-left">Role</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.id} className="border-b">
                            <td className="p-3">{u.id}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3">{u.plan}</td>
                            <td className="p-3">{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
