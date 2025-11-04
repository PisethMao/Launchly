"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="font-poppins relative flex flex-col-reverse items-center md:flex-row justify-between min-h-[90vh] px-6 md:px-20 overflow-hidden bg-linear-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 50 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex-1 text-center md:text-left z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Deploy Websites <br className="hidden md:block" /> Effortlessly with{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Launchly</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto md:mx-0 mb-8">
          One-click automatic deployments with SSL and domains built in.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold shadow-md rounded-xl transition hover:shadow-lg hover:bg-indigo-700 cursor-pointer"
        >
          Get Started
        </motion.button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="flex-1 flex justify-center md:justify-end relative"
      >
        <div className="relative group">
          <Image
            src="/og-launchly.png"
            alt="Launchly Hero Image"
            width={400}
            height={300}
            className="rounded-2xl shadow-2xl transition-transform duration-700 transform group-hover:scale-105 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
        </div>
      </motion.div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-20 w-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-60 bg-blue-400/10 rounded-full blur-2xl animate-[spin_20s_linear_infinite]"></div>
      </div>
    </section>
  );
}
