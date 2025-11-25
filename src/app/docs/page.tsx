"use client";
import { motion } from "framer-motion";
import Link from "next/link";
export default function page() {
  const section = [
    {
      title: "Getting Started",
      description:
        "Learn how Launchly works, how deployments happen, and how to set up your first project.",
      link: "/",
    },
    {
      title: "Deploy with Git",
      description:
        "Deploy GitHub, GitLab, and Bitbucket repos with automatic builds and live previews.",
      link: "/user",
    },
    {
      title: "Deploy ZIP File",
      description:
        "Upload a ZIP file and Launchly will extract, build, and host your static website instantly.",
      link: "/user",
    },
    {
      title: "Custom Domains",
      description:
        "Learn how to connenct custom domains and configure DNS automatically via Cloudflare.",
      link: "/deploy/new",
    },
    {
      title: "Logs & Monitoring",
      description:
        "Understand build logs, live logs, health checks, and how Launchly monitors deploymnts.",
      link: "/user",
    },
    {
      title: "Troubleshooting",
      description:
        "Common erros, fixes, and debugging techniques to quickly solve deployment issue.",
      link: "/user",
    },
  ];
  return (
    <div className="min-h-screen w-full py-20 px-6 bg-linear-to-b font-poppins">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center font-bold text-4xl mb-4"
      >
        Launchly Documentation
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        Everything you need to deploy seamlessly, automate builds, connect
        custom domains, and manage your website through Launchly.
      </motion.p>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {section.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Link href={sec.link}>
              <div className="group relative rounded-2xl p-6 border border-gray-200 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-500">
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 bg-linear-to-br from-pink-100/40 to-purple-50/10"></div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-700 transition">
                  {sec.title}
                </h2>
                <p className="text-sm leading-relaxed">{sec.description}</p>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="mt-4 text-purple-600 font-medium text-sm group-hover:underline"
                >
                  Read more →
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="max-w-3xl mx-auto mt-16 text-center"
      >
        Need more help? Contact support or join our community for tips and best
        practices.
      </motion.div>
    </div>
  );
}
