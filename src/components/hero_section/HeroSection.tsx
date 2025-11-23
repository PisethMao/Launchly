"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Rocket, Zap, Globe, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const features = [
    { icon: Zap, text: "Instant Deploy" },
    { icon: Shield, text: "Auto SSL" },
    { icon: Globe, text: "Custom Domains" }
  ];

  return (
    <section className="font-poppins relative flex flex-col-reverse items-center md:flex-row justify-between min-h-[90vh] px-6 md:px-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex-1 text-center md:text-left z-10 max-w-2xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-indigo-200 dark:border-indigo-800"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Deploy in seconds, not hours
          </span>
        </motion.div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Deploy Websites{" "}
          <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Effortlessly
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
          Experience lightning-fast deployments with automatic SSL, custom domains,
          and zero configuration. Your projects live in seconds.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700"
            >
              <feature.icon className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all hover:from-indigo-700 hover:to-purple-700 cursor-pointer shadow-xl flex items-center justify-center gap-2"
            onClick={() => router.push('/user')}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all cursor-pointer shadow-lg"
            onClick={() => router.push('/docs')}
          >
            View Demo
          </motion.button>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-6 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white dark:border-gray-900"
              />
            ))}
          </div>
          <span>Trusted by 10,000+ developers</span>
        </motion.div>
      </motion.div>

      {/* Visual Section - Animated Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="flex-1 flex justify-center md:justify-end relative mb-12 md:mb-0"
      >
        <motion.div
          animate={floatingAnimation}
          className="relative group"
        >
          {/* Main Card - Mock Dashboard */}
          <div className="relative w-[350px] md:w-[500px] h-[400px] md:h-[500px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform group-hover:scale-105 transition-transform duration-500">
            {/* Header Bar */}
            <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between px-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/80"></div>
                <div className="w-3 h-3 rounded-full bg-white/60"></div>
                <div className="w-3 h-3 rounded-full bg-white/40"></div>
              </div>
              <Rocket className="w-6 h-6 text-white" />
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-4">
              {/* Deployment Status Cards */}
              {[
                { status: "Deployed", time: "2s ago", color: "emerald" },
                { status: "Building", time: "5s ago", color: "amber" },
                { status: "Queued", time: "10s ago", color: "blue" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`}></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        my-awesome-site.com
                      </div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-400 rounded-full text-xs font-medium`}>
                    {item.status}
                  </div>
                </motion.div>
              ))}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Deploys", value: "1.2K" },
                  { label: "Uptime", value: "99.9%" },
                  { label: "Speed", value: "1.8s" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-lg text-center"
                  >
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl opacity-20 blur-xl"
          ></motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl opacity-20 blur-xl"
          ></motion.div>
        </motion.div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}></div>
      </div>
    </section>
  );
}
