"use client";
import { motion } from "framer-motion";
import { STEPS } from "@/data/howItWorksItemData";
import Link from "next/link";
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works"
      className="font-poppins relative isolate bg-white dark:bg-gray-950"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-(--background) to-(--background) dark:via-gray-900/60 dark:to-gray-950"></div>
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            id="how-it-works"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            How Launchly Works
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-400">
            From repository to live URL in three quick steps.
          </p>
        </motion.div>
        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 sm:gap-8 md:grid-cols-3"
        >
          {STEPS.map(({ id, title, desc, Icon }) => (
            <motion.li
              key={id}
              variants={item}
              className="relative rounded-2xl border border-green-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop:blur-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow bg-linear-to-b from-(--background) to-(--background)"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200/70 dark:border-indigo-900 dark:bg-indigo-950">
                  <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="inline-flex min-w-7 items-center h-7 justify-center rounded-full bg-gray-400 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-sm font-semibold px-2">
                  {id}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {desc}
              </p>
              <div className="mt-6 h-px w-full bg-linear-to-b from-transparent to-transparent via-gray-200 dark:via-gray-800"></div>
              {id === 1 && (
                <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <li>• OAuth secure connection</li>
                  <li>• Auto-detect static vs. Node</li>
                </ul>
              )}
              {id === 2 && (
                <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Dockerized, isolated builds</li>
                  <li>• Real-time build logs</li>
                </ul>
              )}
              {id === 3 && (
                <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Free subdomain instantly</li>
                  <li>• Automatic HTTPS</li>
                </ul>
              )}
            </motion.li>
          ))}
        </motion.ol>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 md:mt-14 flex justify-center"
        >
          <Link
            href="/deploy/new"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium shadow-md hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Deploy your first site
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
