"use client";
import { motion } from "framer-motion";
export default function DeploymentPreview() {
  return (
    <section className="font-poppins relative isolate py-20 bg-white dark:bg-gray-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-(--background) to-(--background) dark:from-gray-900 dark:via-gray-950 dark:to-black"></div>
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold"
        >
          See Launchly in Action
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-3 text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
        >
          A clean deployment dashboard that makes going live feel effortless.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto relative max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            https://myapp.launchly.app
          </span>
          <div className="w-6"></div>
        </div>
        <div className="relative aspect-video bg-linear-to-b from-(--background) to-(--background) dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="w-3/4 h-2/3 rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Dashboard Preview Coming Soon
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
