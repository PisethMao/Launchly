"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname();
  const hideOnAuth =
    pathName.startsWith("/login") || pathName.startsWith("/register");

  if (hideOnAuth) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="font-poppins relative mt-0 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-50/30 to-blue-100/50 dark:from-transparent dark:via-blue-950/20 dark:to-blue-950/40" />

      {/* Floating Orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.2 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full bg-linear-to-r from-blue-500/20 to-indigo-500/20 blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1.1 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        className="absolute right-0 top-0 w-[400px] h-[400px] rounded-full bg-linear-to-l from-purple-500/20 to-pink-500/20 blur-[100px] pointer-events-none"
      />

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="group">
              <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform duration-300 inline-block">
                Launchly
              </h2>
              <div className="h-1 w-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mb-4" />
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mb-6">
              Deploy websites automatically from GitHub and GitLab with SSL &
              domains in seconds.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                {
                  href: "https://github.com/PisethMao",
                  icon: "github",
                  label: "GitHub",
                },
                {
                  href: "https://discord.com/channels/@me",
                  icon: "discord",
                  label: "Discord",
                },
                {
                  href: "https://x.com/PisethMao528763",
                  icon: "twitter",
                  label: "Twitter",
                },
              ].map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  className="group relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-linear-to-br hover:from-blue-500 hover:to-purple-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label={social.label}
                >
                  <span className="text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors">
                    {social.icon === "github" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {social.icon === "discord" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    )}
                    {social.icon === "twitter" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/features", label: "Features" },
                { href: "/docs", label: "Documentation" },
                { href: "/price", label: "Pricing" },
                { href: "/deploy/new", label: "Deploy Now" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/changelog", label: "Changelog" },
                { href: "/guides", label: "Guides" },
                { href: "/support", label: "Support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/cookies", label: "Cookie Policy" },
                { href: "/security", label: "Security" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get the latest updates and news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                className="cursor-pointer px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:shadow-lg text-sm"
              >
                →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span>© {new Date().getFullYear()} Launchly.</span>
            <span className="hidden md:inline">Deploy smart. Deploy fast.</span>
            <span className="text-lg">🚀</span>
          </p>

          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500 dark:text-gray-500">
              Made with ❤️ in Cambodia
            </span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold">
                All Systems Operational
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
