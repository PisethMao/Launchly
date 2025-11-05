"use client";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="font-poppins relative mt-20 border-t border-gray-200 dark:border-gray-800 bg-linear-to-b from-(--background) to-(--background) dark:from-gray-950 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1.1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute left-0 bottom-0 w-[350px] h-[350px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none"
      ></motion.div>
      <div className="max-w-7xl mx-auto px-6 py-14 relative z-10 flex flex-col gap-10">
        <div>
          <h2 className="text-2xl font-bold">Launchly</h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            Deploy websites automatically from GitHub and GitLab with SSL &
            domains in seconds.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="font-semibold mb-2">Navigation</h3>
            <Link
              href="/features"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              Features
            </Link>
            <Link
              href="/docs"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              Docs
            </Link>
            <Link
              href="/price"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              Pricing
            </Link>
            <Link
              href="/features"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              Deploy Now
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="font-semibold mb-2">Community</h3>
            <Link
              href="https://github.com/PisethMao"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              GitHub
            </Link>
            <Link
              href="https://discord.com/channels/@me"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              Discord
            </Link>
            <Link
              href="https://x.com/PisethMao528763"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 py-5 text-center text-sm text-gray-600 dark:text-gray-500">
        Launchly © {new Date().getFullYear()} - Deploy smart. Deploy fast. 🚀
      </div>
    </footer>
  );
}
