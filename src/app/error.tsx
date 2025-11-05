"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Error({ error, reset }: ErrorPageProps) {
  const [message, setMessageError] = useState("An unexpected error occurred.");
  useEffect(() => {
    console.log("🔥 Error caugth by error.tsx: ", error);
    if (error?.message) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessageError(error.message);
    }
  }, [error]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-poppins flex flex-col min-h-screen items-center justify-center bg-linear-to-b from-(--background) to-(--background) dark:bg-gray-900 text-center px-6 select-none"
    >
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-6xl font-extrabold text-red-600 dark:text-red-400 mb-4 drop-shadow-sm"
      >
        500
      </motion.h1>
      <motion.p
        transition={{ delay: 0.2 }}
        className="text-xl text-gray-700 dark:text-gray-300 mb-2"
      >
        Something went wrong.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mt-2"
      >
        {message}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4"
      >
        {reset && (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md cursor-pointer"
          >
            Try Again
          </motion.button>
        )}
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition shadow-sm"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
