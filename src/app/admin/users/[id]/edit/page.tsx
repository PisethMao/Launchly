/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "USER",
        plan: "Free",
    });

    useEffect(() => {
        if (!id) return;

        async function loadUser() {
            const res = await fetch(`/api/admin/users/${id}`, {
                credentials: "include",
            });

            if (!res.ok) {
                setError("Failed to load user");
                setLoading(false);
                return;
            }

            const data = await res.json();

            setForm({
                name: data.name,
                email: data.email,
                role: data.role,
                plan: data.plan,
            });

            setLoading(false);
        }

        loadUser();
    }, [id]);

    function handleChange(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: any) {
        e.preventDefault();

        const res = await fetch(`/api/admin/users/${id}`, {
            credentials: "include",
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            setError("Update failed");
            return;
        }

        router.push("/admin/users");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-3xl font-bold mb-6">Edit User</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border p-2 rounded"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full border p-2 rounded"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block mb-1">Role</label>
                    <select
                        name="role"
                        className="w-full border p-2 rounded"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Plan</label>
                    <select
                        name="plan"
                        className="w-full border p-2 rounded"
                        value={form.plan}
                        onChange={handleChange}
                    >
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                    </select>
                </div>

                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Update User
                </button>
            </form>
        </div>
    );
}
