/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import UserDeleteLoading from "./DeleteUserLoading";
import Toast from "./Toast";

export function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [users, setUsers] = useState<any[]>([]);
    const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = planFilter === "all" || u.plan === planFilter;
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesPlan && matchesRole;
    });

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

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "warning";
    } | null>(null);

    const showToast = (
        message: string,
        type: "success" | "error" | "warning"
    ) => {
        setToast({ message, type });
    };

    const [isDeleting, setIsDeleting] = useState(false);
    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        setIsDeleting(true);
        const res = await fetch(`/api/admin/users/${id}/delete`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            setIsDeleting(false);
            showToast("Failed to delete user", "error");
            return;
        }
        setIsDeleting(false);
        showToast("User deleted successfully", "success");
        // Refresh UI (remove from list locally)
        setUsers(users.filter((u) => u.id !== id));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Users Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Manage user accounts and permissions
                    </p>
                </div>
                <button
                    onClick={() => {
                        redirect("/admin/users/create");
                    }}
                    className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 active:scale-95 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create User
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-hover:text-blue-500 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Plans</option>
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    onMouseEnter={() => setHoveredRow(u.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-all duration-300 ${
                                        hoveredRow === u.id
                                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 scale-[1.02] shadow-lg"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-900"
                                    }`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                        {u.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {u.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-4 py-2 text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 ${
                                                u.plan === "Enterprise"
                                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                    : u.plan === "Pro"
                                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                                            }`}
                                        >
                                            {u.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-4 py-2 text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 ${
                                                u.role === "admin"
                                                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                                                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                            }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    redirect(
                                                        `/admin/users/${u.id}/edit`
                                                    )
                                                }
                                                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(u.id)
                                                }
                                                className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 animate-bounce">
                            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No users found matching your criteria
                        </p>
                    </div>
                )}
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {isDeleting && <UserDeleteLoading />}
        </div>
    );
}
