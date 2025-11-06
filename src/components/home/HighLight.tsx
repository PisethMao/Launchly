"use client";
import { FEATURES } from "@/data/highLightItemData";
import { motion } from "framer-motion";
export default function HighLight() {
  return (
    <section className="font-poppins relative isolate py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-(--background) to-(--background) dark:from-gray-900/60 dark:via-gray-950 dark:to-gray-950"></div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 mb-14 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Why Launchly?</h2>
        <p className="m-3 text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
          Deployment should feel effortless. Launchly removes the pain,
          complexity, and configuration work.
        </p>
      </motion.div>
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ startTime: 0.15 }}
          className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map(({ title, desc, Icon }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-2xl border border-gray-200/60 dark:border-gray-800 dark:bg-gray-900/60 backdrop-blur-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl dark:bg-indigo-950 border border-indigo-200/60 dark:border-indigo-900">
                  <Icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="mb-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-6">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
