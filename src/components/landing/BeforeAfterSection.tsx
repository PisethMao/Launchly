/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import { X, Check, ArrowRight, Frown, Smile, Clock, Zap } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const}
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function BeforeAfterSection() {
  const beforePoints = [
    "Manually configure servers, Nginx, firewalls, Node/PM2",
    "Generate SSL yourself and renew certificates every 90 days",
    "Debug deployment issues with no logs or unclear errors",
    "Spend hours each time you deploy or change hosting"
  ];

  const afterPoints = [
    "Deploy in one click. No servers, configs, or DevOps required",
    "Automatic HTTPS certificates - always valid, no maintenance",
    "Real-time build logs and isolated environments for every deploy",
    "Push code → Launchly deploys instantly. Fast and reliable"
  ];

  return (
    <section className="font-poppins relative py-24 md:py-32 overflow-hidden bg-linear-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-linear-to-r from-red-100 via-yellow-100 to-green-100 dark:from-red-950/50 dark:via-yellow-950/50 dark:to-green-950/50 rounded-full border border-gray-200 dark:border-gray-800"
          >
            <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
            <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
          </motion.div>

          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-5">
            <span className="bg-linear-to-r from-gray-900 via-indigo-900 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              Before vs After Launchly
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how Launchly transforms your deployment workflow from painful to effortless.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative"
        >
          {/* Connecting Arrow (Desktop) */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-200 dark:border-gray-800 shadow-xl">
            <ArrowRight className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Before Card */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="relative h-full p-8 md:p-10 rounded-3xl border-2 border-red-200/80 dark:border-red-900/50 bg-linear-to-br from-white to-red-50/30 dark:from-gray-900 dark:to-red-950/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-500 via-orange-500 to-red-500"></div>

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-orange-600 shadow-lg">
                    <Frown className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Before Launchly
                  </h3>
                </div>
              </div>

              {/* Pain Points */}
              <ul className="space-y-5">
                {beforePoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group/item"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md group-hover/item:blur-lg transition-all"></div>
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 border-2 border-red-300 dark:border-red-800">
                          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </div>
                    <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Stats Badge */}
              <div className="mt-8 pt-6 border-t border-red-200 dark:border-red-900/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Average setup time:</span>
                  <span className="font-bold text-red-600 dark:text-red-400 text-lg">4-8 hours</span>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-red-500/0 via-orange-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-orange-500/5 group-hover:to-red-500/5 transition-all duration-700 pointer-events-none"></div>
            </div>
          </motion.div>

          {/* After Card */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="relative h-full p-8 md:p-10 rounded-3xl border-2 border-green-300/80 dark:border-green-900/50 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-green-500 via-emerald-500 to-green-500"></div>

              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-xl animate-pulse"></div>
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg">
                      <Smile className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    After Launchly
                  </h3>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-5">
                {afterPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group/item"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover/item:blur-lg transition-all"></div>
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50 border-2 border-green-300 dark:border-green-800">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                    <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Stats Badge */}
              <div className="mt-8 pt-6 border-t border-green-200 dark:border-green-900/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Average deploy time:</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">Under 60 seconds</span>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-emerald-500/5 group-hover:to-green-500/5 transition-all duration-700 pointer-events-none"></div>

              {/* Success Indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
              ></motion.div>
            </div>

            {/* Outer Glow */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 blur-2xl transition-all duration-500"></div>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Join thousands of developers who've made the switch
          </p>
        </motion.div>
      </div>
    </section>
  );
}
