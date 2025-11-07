"use client";
import { motion } from "framer-motion";
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex relative items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl"
        ></motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-20 h-20 border-[3px] border-indigo-500/40 border-t-indigo-500 rounded-full"
        ></motion.div>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.8 }}
          className="absolute text-xl font-semibold tracking-wide text-gray-900 dark:text-gray-100 cursor-pointer transition-transform"
        ></motion.span>
      </motion.div>
    </div>
  );
}
