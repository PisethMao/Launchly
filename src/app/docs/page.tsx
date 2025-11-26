 
"use client";
 
import React, { useState } from "react";
import {
  Upload,
  Github,
  Gitlab,
  Lock,
  Eye,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";

const DeploymentDocsPage = () => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false });
    }, 2000);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 transition-colors duration-300">
      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div
        className="fixed bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative border-b backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div {...fadeInUp} className="text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">
                Documentation
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Deploy Your Project in{" "}
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Seconds
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
              Multiple deployment options to fit your workflow. Choose the
              method that works best for you.
            </p>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { icon: Zap, label: "< 30s", desc: "Deploy Time" },
                { icon: Shield, label: "100%", desc: "Secure" },
                { icon: Rocket, label: "4", desc: "Methods" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 text-white mb-3">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Method 1: Public Repository */}
          <motion.div
            variants={fadeInUp}
            className="group rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative bg-linear-to-r from-gray-800 via-gray-900 to-black px-8 py-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="flex gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Github className="w-7 h-7 text-white" />
                  </div>
                  <div className="bg-orange-500 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Gitlab className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    GitHub/GitLab Repository
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Deploy from your public GitHub/GitLab repos
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                  Deploy your static website by connecting your public
                  GitHub/GitLab repository directly. Perfect for simple projects
                  and quick deployments.
                </p>

                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
                  Project Structure Requirements
                </h3>

                <div className="relative rounded-2xl p-6 bg-gray-950 dark:bg-black border border-gray-800 overflow-hidden group/code">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `project/
├── index.html          # Required: Must be in root
├── styles.css
├── script.js
├── assets/
│   ├── images/
│   └── fonts/
└── pages/
    ├── about.html
    └── contact.html`,
                        "structure1"
                      )
                    }
                    className="absolute top-4 right-4 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 z-10"
                  >
                    {copiedStates["structure1"] ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400 group-hover/code:text-gray-300" />
                    )}
                  </button>
                  <pre className="text-sm text-gray-300 overflow-x-auto font-mono">
                    {`project/
├── index.html          # Required: Must be in root
├── styles.css
├── script.js
├── assets/
│   ├── images/
│   └── fonts/
└── pages/
    ├── about.html
    └── contact.html`}
                  </pre>
                </div>

                <div className="mt-8 rounded-2xl p-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700/50">
                  <div className="flex gap-4">
                    <div className="text-3xl">⚠️</div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-amber-900 dark:text-amber-300 mb-3">
                        Important Requirements
                      </p>
                      <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400 mt-0.5">
                            •
                          </span>
                          <span>
                            <code className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40 font-mono text-sm">
                              index.html
                            </code>{" "}
                            must be in the root directory
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400 mt-0.5">
                            •
                          </span>
                          <span>
                            No{" "}
                            <code className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40 font-mono text-sm">
                              node_modules
                            </code>{" "}
                            folder allowed
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400 mt-0.5">
                            •
                          </span>
                          <span>
                            Only static files (HTML, CSS, JavaScript, images,
                            fonts)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Method 2: GitHub Private */}
          <motion.div
            variants={fadeInUp}
            className="group rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative bg-linear-to-r from-gray-800 via-gray-900 to-black px-8 py-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Github className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    GitHub Private Repository
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Deploy from your private GitHub repos with access tokens
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                Connect your GitHub account and deploy directly from your
                private repositories with personal access tokens.
              </p>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                <div className="w-1 h-8 bg-linear-to-b from-gray-600 to-gray-800 rounded-full" />
                Creating a GitHub Personal Access Token
              </h3>

              <div className="space-y-5">
                {[
                  {
                    title: "Navigate to GitHub Settings",
                    desc: (
                      <>
                        Go to{" "}
                        <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                          Settings → Developer settings → Personal access tokens
                          → Tokens (classic)
                        </code>
                      </>
                    ),
                  },
                  {
                    title: "Generate New Token",
                    desc: 'Click "Generate new token (classic)" and provide a descriptive name',
                  },
                  {
                    title: "Select Permissions",
                    desc: (
                      <>
                        Enable the{" "}
                        <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                          repo
                        </code>{" "}
                        scope to grant full repository access
                      </>
                    ),
                  },
                  {
                    title: "Save Your Token",
                    desc: "Copy and store the token securely - it won't be visible again!",
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-5 items-start p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 bg-linear-to-br from-gray-700 to-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                        {step.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl p-5 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700/50 flex items-start gap-3">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-blue-900 dark:text-blue-300">
                  Your token is encrypted and stored securely. We only use it to
                  access the repositories you authorize.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Method 3: GitLab Private */}
          <motion.div
            variants={fadeInUp}
            className="group rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative bg-linear-to-r from-orange-500 via-red-500 to-pink-500 px-8 py-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Gitlab className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    GitLab Private Repository
                  </h2>
                  <p className="text-orange-100 text-lg">
                    Deploy from your private GitLab repos with access tokens
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                Connect your GitLab account and deploy directly from your
                private repositories with personal access tokens.
              </p>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                <div className="w-1 h-8 bg-linear-to-b from-orange-500 to-red-500 rounded-full" />
                Creating a GitLab Personal Access Token
              </h3>

              <div className="space-y-5">
                {[
                  {
                    title: "Navigate to GitLab Settings",
                    desc: (
                      <>
                        Go to{" "}
                        <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                          User Settings → Access Tokens
                        </code>
                      </>
                    ),
                  },
                  {
                    title: "Create New Token",
                    desc: "Provide a token name and set an optional expiry date",
                  },
                  {
                    title: "Select Scopes",
                    desc: (
                      <>
                        Enable{" "}
                        <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm">
                          read_repository
                        </code>{" "}
                        to grant read access to your repositories
                      </>
                    ),
                  },
                  {
                    title: "Save Your Token",
                    desc: "Copy it immediately - you won't be able to see it again!",
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-5 items-start p-5 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700/30 hover:border-orange-300 dark:hover:border-orange-600/50 transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                        {step.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Method 4: ZIP Upload */}
          <motion.div
            variants={fadeInUp}
            className="group rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    ZIP File Upload
                  </h2>
                  <p className="text-emerald-100 text-lg">
                    Upload your entire project as a compressed file
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                Package your entire project into a ZIP file and upload it all at
                once. Quick and convenient for projects with many files.
              </p>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                <div className="w-1 h-8 bg-linear-to-b from-emerald-500 to-teal-500 rounded-full" />
                ZIP Structure Requirements
              </h3>

              <div className="relative rounded-2xl p-6 bg-gray-950 dark:bg-black border border-gray-800 overflow-hidden group/code mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                <button
                  onClick={() =>
                    copyToClipboard(
                      `project.zip
└── (when extracted)
    ├── index.html       # Must be at root level
    ├── styles.css
    ├── script.js
    └── assets/
        └── images/`,
                      "structure2"
                    )
                  }
                  className="absolute top-4 right-4 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 z-10"
                >
                  {copiedStates["structure2"] ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400 group-hover/code:text-gray-300" />
                  )}
                </button>
                <pre className="text-sm text-gray-300 overflow-x-auto font-mono">
                  {`project.zip
└── (when extracted)
    ├── index.html       # Must be at root level
    ├── styles.css
    ├── script.js
    └── assets/
        └── images/`}
                </pre>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-300 text-lg">
                      Correct Structure
                    </p>
                  </div>
                  <code className="text-sm block text-emerald-800 dark:text-emerald-200 space-y-1">
                    <div>project.zip → index.html</div>
                    <div>project.zip → styles.css</div>
                    <div>project.zip → assets/</div>
                  </code>
                </div>
                <div className="rounded-2xl p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
                      ✗
                    </div>
                    <p className="font-bold text-red-900 dark:text-red-300 text-lg">
                      Wrong Structure
                    </p>
                  </div>
                  <code className="text-sm block text-red-800 dark:text-red-200 space-y-1">
                    <div>project.zip → project/ → index.html</div>
                    <div>project.zip → src/ → index.html</div>
                    <div>project.zip → dist/ → index.html</div>
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Public vs Private */}
          <motion.div
            variants={fadeInUp}
            className="rounded-3xl shadow-xl overflow-hidden bg-white dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 border border-gray-800"
          >
            <div className="p-10 text-white">
              <div className="flex items-start gap-5 mb-8">
                <div className="bg-black/80 dark:bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-3 text-gray-700 dark:text-gray-300">
                    Deploy Without Login
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-xl">
                    Start deploying immediately, no account required
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      Without Account
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Deploy instantly without signing up</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Project is publicly visible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Get a shareable URL immediately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Can link to account later</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                      With Account
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Manage all your projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Control privacy settings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Edit and redeploy easily</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xl">•</span>
                        <span>Custom domain support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-start gap-4">
                <span className="text-3xl">💡</span>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  <span className="font-bold">Pro Tip:</span> Deploy without an
                  account to test, then sign up to claim ownership and unlock
                  more features!
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="relative rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

            <div className="relative p-12 text-center text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Deploy?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Choose any method above and get your project live in seconds. No
                complex configuration required.
              </p>
              <button className="group relative inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                <span>Start Deploying Now</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeploymentDocsPage;
