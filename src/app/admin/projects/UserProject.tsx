/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Search, Activity, Eye, Trash2 } from "lucide-react";

export function ProjectsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);
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

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.projectType === typeFilter;
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
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text">
          Projects Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          View and manage all projects across the platform
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-500">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-hover:text-blue-500 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search by subdomain or owner email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="deploying">Deploying</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="Next.js">Next.js</option>
            <option value="React">React</option>
            <option value="Vue">Vue</option>
            <option value="Static">Static</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Subdomain
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProjects.map((p, idx) => (
                <tr
                  key={p.id}
                  onMouseEnter={() => setHoveredRow(p.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`transition-all duration-300 ${
                    hoveredRow === p.id
                      ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 scale-[1.02] shadow-lg"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {p.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Eye
                        className={`w-4 h-4 transition-all duration-300 ${
                          hoveredRow === p.id
                            ? "text-blue-600 dark:text-blue-400 scale-110"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {p.subdomain}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {p.user?.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-4 py-2 text-xs font-bold rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-shadow">
                      {p.projectType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 inline-flex items-center gap-2 ${
                        p.status === "running"
                          ? "bg-linear-to-r from-green-500 to-emerald-500 text-white"
                          : p.status === "inactive"
                          ? "bg-linear-to-r from-gray-400 to-gray-500 text-white"
                          : "bg-linear-to-r from-yellow-400 to-orange-400 text-white animate-pulse"
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
                        type="button"
                        onClick={() =>
                          window.open(
                            `https://${p.subdomain}.chanchhay.site`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 transform hover:scale-110"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.subdomain)}
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
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 animate-bounce">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No projects found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
