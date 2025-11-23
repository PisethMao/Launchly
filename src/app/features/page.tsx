/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
    Zap,
    Shield,
    Globe,
    Rocket,
    Code2,
    GitBranch,
    BarChart3,
    Lock,
    Sparkles,
    Terminal,
    Eye,
    Clock,
    Layers,
    RefreshCw,
    Award,
    Users,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

const FeaturesPage = () => {
    const [activeTab, setActiveTab] = useState("deploy");

    const features = [
        {
            icon: Rocket,
            title: "Lightning Fast Deployment",
            description:
                "Deploy your projects in seconds with our optimized build pipeline. No waiting, no hassle.",
            color: "from-blue-500 to-cyan-500",
            stats: "< 10s",
            statsLabel: "Average Deploy Time",
        },
        {
            icon: Globe,
            title: "Global CDN Distribution",
            description:
                "Your content delivered from the nearest edge location for blazing fast load times worldwide.",
            color: "from-purple-500 to-pink-500",
            stats: "200+",
            statsLabel: "Edge Locations",
        },
        {
            icon: Shield,
            title: "Enterprise-Grade Security",
            description:
                "SSL certificates, DDoS protection, and encrypted deployments out of the box.",
            color: "from-emerald-500 to-teal-500",
            stats: "100%",
            statsLabel: "SSL Coverage",
        },
        {
            icon: Code2,
            title: "Zero Configuration",
            description:
                "Just upload your files. We automatically detect and optimize your project structure.",
            color: "from-orange-500 to-red-500",
            stats: "0",
            statsLabel: "Config Files Needed",
        },
        {
            icon: GitBranch,
            title: "Git Integration",
            description:
                "Connect GitHub and GitLab repos. Push to deploy automatically with webhooks.",
            color: "from-indigo-500 to-purple-500",
            stats: "2",
            statsLabel: "Git Platforms",
        },
        {
            icon: BarChart3,
            title: "Real-Time Analytics",
            description:
                "Monitor traffic, performance metrics, and visitor insights with beautiful dashboards.",
            color: "from-yellow-500 to-orange-500",
            stats: "Live",
            statsLabel: "Data Updates",
        },
    ];

    const tabs = [
        {
            id: "deploy",
            label: "Deployment",
            icon: Rocket,
            content: [
                {
                    icon: Zap,
                    title: "Instant Builds",
                    desc: "Optimized build process that completes in seconds",
                },
                {
                    icon: RefreshCw,
                    title: "Auto Rollback",
                    desc: "Revert to any previous version with one click",
                },
                {
                    icon: Layers,
                    title: "Preview Deployments",
                    desc: "Test changes before going live",
                },
                {
                    icon: Terminal,
                    title: "Build Logs",
                    desc: "Detailed logs for debugging and monitoring",
                },
            ],
        },
        {
            id: "security",
            label: "Security",
            icon: Shield,
            content: [
                {
                    icon: Lock,
                    title: "Private Projects",
                    desc: "Password-protected deployments for sensitive content",
                },
                {
                    icon: Shield,
                    title: "DDoS Protection",
                    desc: "Enterprise-level protection against attacks",
                },
                {
                    icon: Award,
                    title: "SSL Certificates",
                    desc: "Free automatic SSL for all deployments",
                },
                {
                    icon: Eye,
                    title: "Access Control",
                    desc: "Manage who can view and edit your projects",
                },
            ],
        },
        {
            id: "workflow",
            label: "Workflow",
            icon: GitBranch,
            content: [
                {
                    icon: GitBranch,
                    title: "Git Webhooks",
                    desc: "Auto-deploy on push to your repository",
                },
                {
                    icon: Users,
                    title: "Team Collaboration",
                    desc: "Invite team members to manage projects",
                },
                {
                    icon: Clock,
                    title: "Scheduled Deploys",
                    desc: "Set up automatic deployments at specific times",
                },
                {
                    icon: Sparkles,
                    title: "Deploy Previews",
                    desc: "Preview changes from pull requests",
                },
            ],
        },
    ];

    const FeatureCard = ({
        feature,
        index,
    }: {
        feature: any;
        index: number;
    }) => {
        const ref = React.useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                    style={{
                        background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                />
                <div
                    className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl
        rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300
        border border-slate-200 dark:border-slate-700/60 h-full"
                >
                    <div
                        className={`w-16 h-16 bg-gradient-to-r ${feature.color}
          rounded-xl flex items-center justify-center mb-6
          group-hover:scale-110 transition-transform duration-300`}
                    >
                        <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {feature.description}
                    </p>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-end gap-2">
                            <span
                                className={`text-4xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                            >
                                {feature.stats}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm pb-1">
                                {feature.statsLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* HERO */}
            <div
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black"
            >
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
                    <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-blue-300" />
                            <span className="text-blue-100 text-sm font-medium">
                                Powerful Features
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                            Everything You Need
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                To Deploy & Scale
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            From instant deployments to enterprise security,
                            we've built the platform that grows with your
                            projects. No limits, no compromises.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* TABS */}
            <div className="bg-white dark:bg-slate-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Dive Deeper Into Features
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Explore the capabilities that make us the best
                            choice for developers
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {tabs
                            .find((t) => t.id === activeTab)
                            ?.content.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.1,
                                    }}
                                    className="bg-gradient-to-br from-slate-50 to-blue-50
                dark:from-slate-800/40 dark:to-slate-900/40
                rounded-xl p-6 border border-slate-200 dark:border-slate-700
                hover:border-blue-300 dark:hover:border-blue-500
                hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                                            <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </motion.div>
                </div>
            </div>

            {/* STATS */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            {
                                number: "99.99%",
                                label: "Uptime SLA",
                                icon: Zap,
                            },
                            {
                                number: "50ms",
                                label: "Avg Response Time",
                                icon: Clock,
                            },
                            {
                                number: "10M+",
                                label: "Deploys per Month",
                                icon: Rocket,
                            },
                            {
                                number: "150+",
                                label: "Countries Served",
                                icon: Globe,
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="text-white"
                            >
                                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                                <div className="text-5xl font-bold mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-blue-200 dark:text-blue-300 text-lg">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-slate-900 to-slate-800
          dark:from-black dark:to-slate-900
          rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10" />

                    <div className="relative">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Experience the Difference?
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers who have already made
                            the switch to faster, more reliable deployments.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                className="bg-white text-slate-900
              dark:bg-slate-800 dark:text-slate-100
              px-8 py-4 rounded-xl font-bold text-lg
              hover:bg-slate-100 dark:hover:bg-slate-700
              transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Start Deploying Free
                            </button>
                            <button
                                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg
              hover:bg-blue-700 transition-all border-2 border-blue-500 dark:border-blue-400 hover:scale-105"
                            >
                                View Pricing
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturesPage;
