"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { baseUrl } from "@/utils/urls";
import {
  Rocket,
  LogOut,
  Activity,
  TrendingUp,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";

type DeploymentRecord = {
  id: string;
  projectName: string;
  subdomain: string | null;
  status: string;
  liveUrl: string | null;
  createdAt: string;
};

export default function page() {
  interface Deployment {
    id: string;
    name: string;
    liveUrl: string;
    status: string;
    updatedAt: string;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/deployments/list", { cache: "no-store" });
        if (!res.ok) {
          console.error(
            "Failed to fetch deployments: ",
            res.status,
            res.statusText
          );
          return;
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.error("Expected JSON but got: ", contentType);
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.deployments) {
          const formatted = data.deployments.map((d: DeploymentRecord) => ({
            id: d.id,
            name: d.projectName || d.subdomain || "Unnamed project",
            liveUrl: d.liveUrl ?? "http://not-deployed-yet",
            status: d.status === "running" ? "Healthy" : "Building",
            updatedAt: new Date(d.createdAt).toLocaleString(),
          }));
          setDeployments(formatted);
        }
      } catch (err) {
        console.error("Error fetching deployments: ", err);
      }
    };

    load(); // first fetch
    const interval = setInterval(load, 3000); // every 5 seconds

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="font-poppins min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-40">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome {session?.user?.name}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="px-3 py-1.5 rounded-full bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-500/30">
                  <span className="text-gray-600 dark:text-gray-300">
                    Current Plan:{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {session?.user?.plan}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/deploy/new"
                className="group px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95 flex items-center gap-2"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                New Deployment
              </Link>
              <Link
                href="/deploy-zip"
                className="group px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95 flex items-center gap-2"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Zip Deployment
              </Link>

              <button
                type="button"
                onClick={() => {
                  signOut({ callbackUrl: `${baseUrl}` });
                }}
                className="dark:text-white px-6 py-3 cursor-pointer rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-60 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-black dark:text-white text-sm font-medium mb-2">
                  Total Deployments
                </p>
                <h3 className="text-4xl dark:text-white font-bold">
                  {deployments.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl backdrop-blur-sm bg-linear-to-br from-blue-500/20 to-indigo-600/20">
                <TrendingUp className="w-6 h-6 dark:text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-60 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="dark:text-white text-black text-sm font-medium mb-2">
                  Active Builds
                </p>
                <h3 className="dark:text-white text-4xl font-bold">
                  {deployments.filter((d) => d.status === "Building").length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm">
                <Loader2 className="dark:text-white w-6 h-6 animate-spin" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-60 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="dark:text-white text-black text-sm font-medium mb-2">
                  Healthy Sites
                </p>
                <h3 className="dark:text-white text-4xl font-bold">
                  {deployments.filter((d) => d.status === "Healthy").length}
                </h3>
              </div>
              <div className="p-3 rounded-xl backdrop-blur-sm bg-linear-to-br from-emerald-500/20 to-green-600/20">
                <CheckCircle2 className="dark:text-white w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Deployments Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Deployments
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deployments.map((d, i) => (
              <motion.div
                key={`${d.id}-${d.updatedAt}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg capitalize text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {d.name}
                    </h3>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                        d.status === "Healthy"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/30"
                          : "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-500/30"
                      }`}
                    >
                      {d.status === "Healthy" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {d.status}
                    </span>
                  </div>

                  {/* URL */}
                  <a
                    href={d.liveUrl}
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium group/link"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">{d.liveUrl}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                  </a>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
                    Updated {d.updatedAt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
