"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function NotFoundPage() {
  return (
    <section className="font-poppins flex flex-col items-center justify-center min-h-screen px-6 text-center bg-linear-to-b from-(--background) to-(--background) dark:from-gray-950 dark:to-gray-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.3 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-20 -left-20 w-[350px] h-[350px] rounded-full bg-indigo-400/30 blur-[120px] dark:bg-indigo-500/20"
      ></motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-7xl md:text-9xl font-bold select-none"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-xl md:text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-xl"
      >
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md hover:shadow-xl transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-5 h-5" /> Go back home
        </Link>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-sm text-gray-500 dark:text-gray-500"
      >
        Launchly - Deploy smart, deploy fast 🚀
      </motion.p>
    </section>
  );
}
