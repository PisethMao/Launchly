import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function getDemoDeployments() {
  return [
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
  ];
}
export default async function page() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { name?: string; plan?: string };
  const deployments = await getDemoDeployments();
  return (
    <main className="font-poppins max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name ?? "User"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Plan: <span className="font-medium">{user?.plan ?? "Free"}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/deploy/new"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            New Deployment
          </Link>
          <Link
            href="/billing"
            className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            Billing
          </Link>
        </div>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Deployments</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deployments.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{d.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full border dark:border-gray-700">
                  {d.status}
                </span>
              </div>
              <p className="text-sm truncate mt-1">
                <a
                  href={d.url}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                >
                  {d.url}
                </a>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Updated {d.updatedAt}
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/deploy/${d.id}`}
                  className="text-sm px-3 py-1 rounded-lg border dark:border-gray-700"
                >
                  Manage
                </Link>
                <Link
                  href={`/logs/${d.id}`}
                  className="text-sm px-3 py-1 rounded-lg border dark:border-gray-700"
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
