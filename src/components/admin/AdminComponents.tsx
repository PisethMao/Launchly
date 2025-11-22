/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import {
    Search,
    Users,
    FolderGit2,
    Rocket,
    TrendingUp,
    LogOut,
    Sparkles,
    Activity,
    Zap,
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { baseUrl } from "@/utils/urls";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

// Mock data for demo
const mockStats = {
    totalUsers: 1247,
    totalProjects: 856,
    activeDeployments: 423,
    newUsersThisMonth: 89,
    projectsThisMonth: 134,
    deploymentsThisMonth: 67,
};

const mockProjects = [
    {
        id: 1,
        subdomain: "myapp",
        user: { email: "john@example.com" },
        projectType: "Next.js",
        status: "active",
        createdAt: "2024-01-15",
    },
    {
        id: 2,
        subdomain: "portfolio",
        user: { email: "sarah@example.com" },
        projectType: "React",
        status: "active",
        createdAt: "2024-01-20",
    },
    {
        id: 3,
        subdomain: "blog",
        user: { email: "mike@example.com" },
        projectType: "Static",
        status: "inactive",
        createdAt: "2024-02-01",
    },
    {
        id: 4,
        subdomain: "dashboard",
        user: { email: "emma@example.com" },
        projectType: "Vue",
        status: "active",
        createdAt: "2024-02-10",
    },
    {
        id: 5,
        subdomain: "shop",
        user: { email: "alex@example.com" },
        projectType: "Next.js",
        status: "deploying",
        createdAt: "2024-02-15",
    },
];

const mockUsers = [
    {
        id: "4060631c-a446-4343-9780-dafge",
        name: "John Doe",
        email: "john@example.com",
        plan: "Pro",
        role: "user",
        createdAt: "2023-12-01",
    },
    {
        id: "f01a614b-c9e3-4fe7-82e2-0de3d",
        name: "Sarah Smith",
        email: "sarah@example.com",
        plan: "Free",
        role: "user",
        createdAt: "2024-01-05",
    },
    {
        id: "2b0e2122-bfcf-4c2f-abd0-9dq2",
        name: "Mike Johnson",
        email: "mike@example.com",
        plan: "Enterprise",
        role: "admin",
        createdAt: "2023-11-15",
    },
    {
        id: "cc6405c0-fa56-45d7-ad6c-fd2d3",
        name: "Emma Wilson",
        email: "emma@example.com",
        plan: "Pro",
        role: "user",
        createdAt: "2024-01-20",
    },
    {
        id: "8aa2a361-6558-40bc-929e-ad23",
        name: "Alex Brown",
        email: "alex@example.com",
        plan: "Free",
        role: "user",
        createdAt: "2024-02-01",
    },
];

function StatCard({
    icon: Icon,
    title,
    value,
    change,
    color,
    delay,
}: {
    icon: React.ComponentType<{ className: string }>;
    title: string;
    value: number;
    change?: number;
    color: string;
    delay: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), delay);
    }, [delay]);

    useEffect(() => {
        if (!isVisible) return;
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCounter(value);
                clearInterval(timer);
            } else {
                setCounter(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div
            className={`relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 transform transition-all duration-700 ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
            } hover:scale-105 hover:shadow-2xl group cursor-pointer`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        {title}
                        <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                    </p>
                    <h3 className="text-4xl font-black text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {counter.toLocaleString()}
                    </h3>
                    {change && (
                        <div className="flex items-center gap-2 animate-bounce">
                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                                <TrendingUp className="w-3 h-3 text-white mr-1" />
                                <span className="text-white font-bold text-xs">
                                    +{change}
                                </span>
                            </div>
                            <span className="text-gray-600 text-xs font-medium">
                                this month
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`p-4 rounded-2xl ${color} shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
                >
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    );
}

function ActivityPulse() {
    return (
        <div className="relative inline-flex">
            <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
        </div>
    );
}

function Dashboard() {
    const [loaded, setLoaded] = useState(false);
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

        setLoaded(true);
        load();
    }, []);

    return (
        <div className="space-y-8">
            <div
                className={`flex items-center justify-between transform transition-all duration-700 ${
                    loaded
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-8 opacity-0"
                }`}
            >
                <div>
                    <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2 text-lg">
                        <ActivityPulse />
                        Monitor and manage your platform in real-time
                    </p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: `${baseUrl}` })}
                    className="group flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-300 active:scale-95 transform hover:scale-105 shadow-md hover:shadow-xl"
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={stats.totalUsers + mockStats.totalUsers}
                    change={mockStats.newUsersThisMonth}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    delay={0}
                />
                <StatCard
                    icon={FolderGit2}
                    title="Total Projects"
                    value={stats.totalProjects + mockStats.totalProjects}
                    change={mockStats.projectsThisMonth}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    delay={150}
                />
                <StatCard
                    icon={Rocket}
                    title="Active Deployments"
                    value={
                        stats.activeDeployments + mockStats.activeDeployments
                    }
                    change={mockStats.deploymentsThisMonth}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    delay={300}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            System Activity
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-sm text-gray-600">
                                API Requests (Today)
                            </span>
                            <span className="font-bold text-orange-600">
                                12,847
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-sm text-gray-600">
                                Avg Response Time
                            </span>
                            <span className="font-bold text-green-600">
                                142ms
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Quick Actions
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <button
                        className="w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-left font-medium text-gray-700 hover:text-blue-600 transform hover:translate-x-2">
                            View Recent Signups →
                        </button>
                        <button className="w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-left font-medium text-gray-700 hover:text-blue-600 transform hover:translate-x-2">
                            Check Failed Deployments →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [mockProjectsData, setMockProjectsData] =
        useState<any[]>(mockProjects);

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

    const filteredProjects = projects.filter((p) => {
        const matchesSearch =
            p.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || p.status === statusFilter;
        const matchesType =
            typeFilter === "all" || p.projectType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });
    const filteredMockProjects = mockProjectsData.filter((p) => {
        const matchesSearch =
            p.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || p.status === statusFilter;
        const matchesType =
            typeFilter === "all" || p.projectType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

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
        <div className="space-y-6">
            <div className="animate-fade-in">
                <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Projects Management
                </h1>
                <p className="text-gray-600 text-lg">
                    View and manage all projects across the platform
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Search by subdomain or owner email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 cursor-pointer font-medium"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deploying">Deploying</option>
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 cursor-pointer font-medium"
                    >
                        <option value="all">All Types</option>
                        <option value="Next.js">Next.js</option>
                        <option value="React">React</option>
                        <option value="Vue">Vue</option>
                        <option value="Static">Static</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Subdomain
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* {filteredMockProjects.map((p, idx) => (
                                <tr
                                    key={p.id}
                                    onMouseEnter={() => setHoveredRow(p.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-all duration-300 ${
                                        hoveredRow === p.id
                                            ? "bg-gradient-to-r from-blue-50 to-purple-50 scale-[1.02] shadow-lg"
                                            : "hover:bg-gray-50"
                                    }`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {p.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Eye
                                                className={`w-4 h-4 transition-all duration-300 ${
                                                    hoveredRow === p.id
                                                        ? "text-blue-600 scale-110"
                                                        : "text-gray-400"
                                                }`}
                                            />
                                            <span className="font-bold text-gray-900">
                                                {p.subdomain}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {p.user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-shadow">
                                            {p.projectType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-4 py-2 text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 inline-flex items-center gap-2 ${
                                                p.status === "active"
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                    : p.status === "inactive"
                                                    ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                                                    : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white animate-pulse"
                                            }`}
                                        >
                                            {p.status === "deploying" && (
                                                <Activity className="w-3 h-3 animate-spin" />
                                            )}
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    console.log("View", p.id)
                                                }
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        p.id,
                                                        p.subdomain
                                                    )
                                                }
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))} */}
                            {filteredProjects.map((p, idx) => (
                                <tr
                                    key={p.id}
                                    onMouseEnter={() => setHoveredRow(p.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-all duration-300 ${
                                        hoveredRow === p.id
                                            ? "bg-gradient-to-r from-blue-50 to-purple-50 scale-[1.02] shadow-lg"
                                            : "hover:bg-gray-50"
                                    }`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {p.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Eye
                                                className={`w-4 h-4 transition-all duration-300 ${
                                                    hoveredRow === p.id
                                                        ? "text-blue-600 scale-110"
                                                        : "text-gray-400"
                                                }`}
                                            />
                                            <span className="font-bold text-gray-900">
                                                {p.subdomain}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {p.user?.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-shadow">
                                            {p.projectType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-4 py-2 text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 inline-flex items-center gap-2 ${
                                                p.status === "running"
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                    : p.status === "inactive"
                                                    ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                                                    : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white animate-pulse"
                                            }`}
                                        >
                                            {p.status === "deploying" && (
                                                <Activity className="w-3 h-3 animate-spin" />
                                            )}
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        `https://${p.subdomain}.chanchhay.site`,
                                                        "_blank",
                                                        "noopener,noreferrer"
                                                    )
                                                }
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        p.id,
                                                        p.subdomain
                                                    )
                                                }
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
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
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 animate-bounce">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                            No projects found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    // const [mockUser] = useState(mockUsers);
    const [users, setUsers] = useState<any[]>([]);
    const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);

    // const filteredMockUsers = mockUser.filter((u) => {
    //     const matchesSearch =
    //     u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     u.email.toLowerCase().includes(searchTerm.toLowerCase());
    //     const matchesPlan = planFilter === "all" || u.plan === planFilter;
    //     const matchesRole = roleFilter === "all" || u.role === roleFilter;
    //     return matchesSearch && matchesPlan && matchesRole;
    // });
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

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const res = await fetch(`/api/admin/users/${id}/delete`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            alert("Failed to delete user");
            return;
        }
        alert("User deleted successfully");

        // Refresh UI (remove from list locally)
        setUsers(users.filter((u) => u.id !== id));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Users Management
                    </h1>
                    <p className="text-gray-600 text-lg">
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

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 cursor-pointer font-medium"
                    >
                        <option value="all">All Plans</option>
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 cursor-pointer font-medium"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* {filteredMockUsers.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    onMouseEnter={() => setHoveredRow(u.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-all duration-300 ${
                                        hoveredRow === u.id
                                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 scale-[1.02] shadow-lg"
                                            : "hover:bg-gray-50"
                                    }`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {u.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900">
                                            {u.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
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
                                                    console.log(
                                                        "Edit user",
                                                        u.id
                                                    )
                                                }
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(u.id)
                                                }
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))} */}
                            {filteredUsers.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    onMouseEnter={() => setHoveredRow(u.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-all duration-300 ${
                                        hoveredRow === u.id
                                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 scale-[1.02] shadow-lg"
                                            : "hover:bg-gray-50"
                                    }`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {u.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900">
                                            {u.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
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
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(u.id)
                                                }
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
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
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 animate-bounce">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                            No users found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function App() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>

            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={`relative py-4 font-bold transition-all duration-300 ${
                                activeTab === "dashboard"
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Dashboard
                            {activeTab === "dashboard" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("projects")}
                            className={`relative py-4 font-bold transition-all duration-300 ${
                                activeTab === "projects"
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Projects
                            {activeTab === "projects" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`relative py-4 font-bold transition-all duration-300 ${
                                activeTab === "users"
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Users
                            {activeTab === "users" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "projects" && <ProjectsManagement />}
                {activeTab === "users" && <UsersManagement />}
            </div>
        </div>
    );
}
