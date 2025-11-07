"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setUser] = useState<{ name?: string; plan?: string } | null>(
    null
  );
  interface Deployment {
    id: string;
    name: string;
    url: string;
    status: string;
    updatedAt: string;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const isAuth = localStorage.getItem("launchly_auth");
    if (!isAuth) {
      router.push("/login");
      return;
    }
    const storedUser = localStorage.getItem("launchly_current_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ name: parsed.name, plan: "free" });
    }
    setDeployments([
      {
        id: "d1",
        name: "portfolio",
        url: "https://portfolio.launchly.dev",
        status: "Healthy",
        updatedAt: "2 min ago",
      },
      {
        id: "d2",
        name: "blog",
        url: "https://blog.launchly.dev",
        status: "Building",
        updatedAt: "1 hr ago",
      },
    ]);
  }, [router]);
  if (!user) {
    return null;
  }
  return (
    <main className="font-poppins max-w-6xl mx-auto px-6 py-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Plan: <span className="font-medium">{user.plan}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/deploy/new"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            New Deployment
          </Link>
          <Link
            href="/billing"
            className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            Billing
          </Link>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("launchly_auth");
              router.push("/");
            }}
            className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Deployments</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deployments.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border dark:border-gray-700 p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold capitalize">{d.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full border dark:border-gray-700 ${
                    d.status === "Healthy"
                      ? "bg-green-200/60 text-green-800 border-green-300"
                      : "bg-yellow-200/60 text-yellow-800 border-yellow-300"
                  }`}
                >
                  {d.status}
                </span>
              </div>
              <a
                href={d.url}
                className="text-indigo-600 hover:underline text-sm truncate mt-1"
                target="_blank"
              >
                {d.url}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Updated {d.updatedAt}
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/deploy/${d.id}`}
                  className="text-sm px-3 py-1.5 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Manage
                </Link>
                <Link
                  href={`/logs/${d.id}`}
                  className="text-sm px-3 py-1.5 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transitio"
                >
                  Logs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
