"use client";
import { FEATURES } from "@/data/highLightItemData";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom easing for smooth entrance
    }
  },
};

export default function HighLight() {
  return (
    <section className="font-poppins relative isolate py-20 md:py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl"
        ></motion.div>

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        ></motion.div>

        {/* Floating Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 rounded-full bg-indigo-400"
            style={{
              top: `${20 + i * 25}%`,
              left: `${30 + i * 20}%`,
            }}
          ></motion.div>
        ))}
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, currentColor 1px, transparent 1px)`,
            backgroundSize: "3rem 3rem",
          }}
        ></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 mb-16 md:mb-20 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-full border border-indigo-200/50 dark:border-indigo-900/50"
        >
          <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" />
          <span className="text-sm font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
            Built for Developers
          </span>
        </motion.div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
          <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
            Why Launchly?
          </span>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Deployment should feel effortless. Launchly removes the pain,
          complexity, and configuration work — so you can focus on building.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map(({ title, desc, Icon }, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full rounded-3xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-700"></div>

                {/* Top Accent Bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left"
                ></motion.div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="relative inline-flex">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                    {/* Icon Circle */}
                    <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Sparkle Effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-400" fill="currentColor" />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {desc}
                  </p>
                </div>

                {/* Bottom Shine Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

                {/* Corner Accent */}
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/0 group-hover:border-indigo-500/40 rounded-br-xl transition-all duration-500"></div>
              </div>

              {/* Outer Glow on Hover */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 blur-2xl transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
    </section>
  );
}
