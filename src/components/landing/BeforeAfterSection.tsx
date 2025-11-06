"use client";
export default function BeforeAfterSection() {
  return (
    <section className="font-poppins py-24 max-w-7xl mx-auto px-6 md:px-12">
      <h2 className="text-center font-bold text-3xl md:text-4xl">
        Before vs After Launcly
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mt-3">
        See how Launchly transforms your deployment workflow.
      </p>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-8 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm">
          <h3 className="text-xl font-semibold">Before Launchly</h3>
          <ul className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-500 text-xl mr-3">✘</span> Manually
              configure servers, Nginx, firewalls, Node/PM2.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 text-xl mr-3">✘</span> Generate SSL
              yourself and renew certificates every 90 days.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 text-xl mr-3">✘</span> Debug
              deployment issues with no logs or unclear errors.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 text-xl mr-3">✘</span> Spend hours
              each time you deploy or change hosting.
            </li>
          </ul>
        </div>
        <div className="p-8 rounded-xl border border-indigo-300 dark:border-indigo-500 dark:bg-gray-900 shadow-lg">
          <h3 className="text-xl font-semibold">After Launchly</h3>
          <ul className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 text-xl mr-3">✔</span> Deploy in
              one click. No servers, configs, or DevOps required.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 text-xl mr-3">✔</span> Automatic
              HTTPS certificates - always valids, no maintenance.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 text-xl mr-3">✔</span> Real-time
              build logs and isolated environments for every deploy.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 text-xl mr-3">✔</span> Push code →
              Launchly deploys instantly. Fast and reliable.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
