"use client";
import { motion } from "framer-motion";
import { Code2, GraduationCap, Users, Rocket, Sparkles, ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom easing for smooth entrance
    }
  },
};

export default function TargetUsersSection() {
  const users = [
    {
      icon: Code2,
      title: "Frontend Developers",
      description: "Build with React, Next.js, Vue - deploy instantly without touching servers.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
      accentColor: "blue",
    },
    {
      icon: GraduationCap,
      title: "Students & Learners",
      description: "Deploy portfolios, assignments, and hackathon projects in seconds.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
      accentColor: "purple",
    },
    {
      icon: Users,
      title: "Small Teams & Startups",
      description: "Focus on product features - not on configuring CI/CD pipelines.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
      accentColor: "orange",
    },
    {
      icon: Rocket,
      title: "Indie Builders",
      description: "Launch your ideas quickly. Iterate. Ship faster than everyone else.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      accentColor: "emerald",
    },
  ];

  return (
    <section className="py-24 md:py-32 font-poppins relative overflow-hidden bg-linear-to-b from-white via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-full border border-indigo-200/50 dark:border-indigo-900/50"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold bg-linear-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              Perfect For Everyone
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <span className="bg-linear-to-r from-gray-900 via-indigo-900 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              Who is Launchly For?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Launchly is built for developers and teams who want to ship fast
            without DevOps complexity
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {users.map((user, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.03,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative"
            >
              {/* Card */}
              <div className={`relative h-full p-8 rounded-3xl border border-gray-200/70 dark:border-gray-800/70 bg-linear-to-br ${user.bgGradient} backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                {/* Top Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${user.gradient}`}></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="relative inline-flex">
                    {/* Glow Effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                      className={`absolute inset-0 ${user.iconBg} rounded-2xl blur-2xl`}
                    ></motion.div>

                    {/* Icon Circle */}
                    <div className={`relative h-16 w-16 flex items-center justify-center rounded-2xl ${user.iconBg} shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                      <user.icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-purple-600 dark:group-hover:from-indigo-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {user.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
                    {user.description}
                  </p>

                  {/* Hover CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className={`bg-linear-to-r ${user.gradient} bg-clip-text text-transparent`}>
                      Learn more
                    </span>
                    <ArrowRight className={`w-4 h-4 text-${user.accentColor}-600 dark:text-${user.accentColor}-400 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-linear-to-br ${user.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none`}></div>

                {/* Bottom Shine */}
                <div className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-${user.accentColor}-500/30 to-transparent`}></div>

                {/* Corner Accent */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-linear-to-br ${user.gradient} opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`}></div>
              </div>

              {/* Outer Glow on Hover */}
              <div className={`absolute inset-0 -z-10 rounded-3xl bg-linear-to-br ${user.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-900/50">
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
              No matter your background, Launchly makes deployment simple
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"></div>
    </section>
  );
}
