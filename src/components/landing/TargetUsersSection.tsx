"use client";
export default function TargetUsersSection() {
  return (
    <section className="py-24 font-poppins max-w-7xl mx-auto px-6 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Who is Launchly For?
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mt-3">
        Launchly is builts for developers and teams who want to ship fast
        without DevOps complexity
      </p>
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm">
          <h3 className="text-lg font-semibold">Frontent Developers</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Build with React, Next.js, Vue - deploy instantly without touching
            servers.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm">
          <h3 className="text-lg font-semibold">Students & Learners</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Deploy portfolios, assignments, and hackathon projects in seconds.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm">
          <h3 className="text-lg font-semibold">Small Teams and Startups</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Focus on product features - not on configuring CI/CD pipelines.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm">
          <h3 className="text-lg font-semibold">Indie Builders</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Launch your ideas quickly. Iterate. Ship faster than everyone else.
          </p>
        </div>
      </div>
    </section>
  );
}
