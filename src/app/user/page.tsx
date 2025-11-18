"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Toast from "@/components/Toast";

type DeploymentRecord = {
  id: string;
  projectName: string;
  subdomain: string | null;
  status: string;
  liveUrl: string | null;
  createdAt: string;
};

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
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
  const { data: session, status } = useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch("/api/deployments/list")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data: ", data);
        const formatted = data.deployments.map((d: DeploymentRecord) => ({
          id: d.id,
          name: d.subdomain,
          liveUrl: d.liveUrl ? `${d.liveUrl}` : "http://not-deployed-yet",
          status: d.status === "running" ? "Healthy" : "Building",
          updatedAt: new Date(d.createdAt).toLocaleString(),
        }));
        setDeployments(formatted);
      })
      .catch(() => setDeployments([]));
  }, [status, router]);
  if (status === "loading") {
    return null;
  }
  return (
    <main className="font-poppins max-w-6xl mx-auto px-6 py-12">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12"
      >
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome,{" "}
            <span className="text-indigo-600">{session?.user?.name}</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Current Plan ·{" "}
            <span className="font-medium">{session?.user?.plan}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/deploy/new"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm hover:shadow-md active:scale-95"
          >
            + New Deployment
          </Link>
          <Link
            href="/billing"
            className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-900 transition active:scale-95"
          >
            Billing
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            className="px-5 py-2.5 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-900 transition active:scale-95"
          >
            Logout
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            key={toast.message}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12"
      >
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Deployments
          </p>
          <h3 className="text-2xl font-semibold mt-1">{deployments.length}</h3>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Builds
          </p>
          <h3 className="text-2xl font-semibold mt-1">
            {deployments.filter((d) => d.status === "Building").length}
          </h3>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Healthy Sites
          </p>
          <h3 className="text-2xl font-semibold mt-1">
            {deployments.filter((d) => d.status === "Healthy").length}
          </h3>
        </div>
      </motion.div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">Your Deployments</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployments.map((d, i) => (
            <motion.div
              key={`${d.id}-${d.updatedAt}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 dark:bg-gray-900 shadow-sm hover:shadow-lg transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold capitalize">{d.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full border dark:border-gray-700 ${
                    d.status === "Healthy"
                      ? "bg-green-200 text-green-900 border-green-300"
                      : "bg-yellow-200 text-yellow-900 border-yellow-300"
                  }`}
                >
                  {d.status}
                </span>
              </div>
              <a
                href={d.liveUrl}
                className="text-indigo-600 dark:text-indigo-400 block hover:underline text-sm truncate mt-1"
                target="_blank"
              >
                {d.liveUrl}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Updated {d.updatedAt}
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/deploy/${d.id}`}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 transition active:scale-95"
                >
                  Manage
                </Link>
                <Link
                  href={`/logs/${d.id}`}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 transition active:scale-95"
                >
                  Logs
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    showToast("Redeploy start!", "success");
                    setTimeout(async () => {
                      await fetch("/api/redeploy", {
                        method: "POST",
                        body: JSON.stringify({ id: d.id }),
                      });
                      router.refresh();
                    }, 400);
                  }}
                  className="text-sm px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 transition active:scale-95 cursor-pointer"
                >
                  Redeploy
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
