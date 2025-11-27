"use client";
import { motion } from "framer-motion";
import { STEPS } from "@/data/howItWorksItemData";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const} },
};

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works"
      className="font-poppins relative isolate overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-indigo-100 dark:bg-indigo-950/50 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Simple & Powerful
            </span>
          </motion.div>

          <h2
            id="how-it-works"
            className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent"
          >
            How Launchly Works
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From repository to live URL in three simple steps. No configuration, no hassle.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid gap-8 md:grid-cols-3 mb-16"
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-14 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900"></div>

          {STEPS.map(({ id, title, desc, Icon }, index) => (
            <motion.li
              key={id}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              {/* Card */}
              <div className="relative h-full rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Gradient Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>

                {/* Top Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Step Number Badge */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:shadow-indigo-500/50 transition-shadow duration-300">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-2 border-indigo-500">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator (Desktop) */}
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-6 z-10">
                      <ArrowRight className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
                    {desc}
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    {id === 1 && (
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            OAuth secure connection
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Auto-detect static vs. Node
                          </span>
                        </div>
                      </>
                    )}
                    {id === 2 && (
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Dockerized, isolated builds
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Real-time build logs
                          </span>
                        </div>
                      </>
                    )}
                    {id === 3 && (
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Free subdomain instantly
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Automatic HTTPS
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-800">
            <Link
              href="/deploy/new"
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              <span>Github/Gitlab Deploy</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              href="/deploy-zip"
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 px-8 py-4 text-gray-800 dark:text-gray-200 font-semibold hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
            >
              <span>Zip Deploy</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            No credit card required • Deploy in under 60 seconds
          </p>
        </motion.div>
      </div>

      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
    </section>
  );
}
