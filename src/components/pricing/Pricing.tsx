"use client";
import { useState } from "react";

type Feature = { label: string };
type Plan = {
  id: "free" | "starter" | "pro" | "enterprise";
  name: string;
  price: string;
  yearlyPrice?: string;
  priceNote?: string;
  description: string;
  ctaLabel: string;
  highlighted?: boolean;
  features: Feature[];
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    yearlyPrice: "$0",
    description:
      "Get started with effortless one-click deployments and automatic HTTPS on a Launchly subdomain.",
    ctaLabel: "Start free",
    features: [
      { label: "1 active project" },
      { label: "One-click deployments" },
      { label: "Automatic HTTPS certificates" },
      { label: "Custom subdomain: yourproject.launchly.app" },
      { label: "Real-time build logs (basic view)" },
      { label: "Isolated sandbox environment" },
      { label: "Community support" },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$12",
    yearlyPrice: "$10",
    description:
      "For freelancers and small teams who want custom domains, faster builds, and essential analytics.",
    ctaLabel: "Upgrade to Starter",
    features: [
      { label: "Up to 5 projects" },
      { label: "Custom domains included" },
      { label: "Automatic SSL, zero maintenance" },
      { label: "Priority build queue (faster deploys)" },
      { label: "Basic analytics (traffic, uptime, history)" },
      { label: "Email support (24-48h response)" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$40",
    yearlyPrice: "$34",
    description:
      "For growing startups and agencies needing unlimited projects, collaboration, and staging previews.",
    ctaLabel: "Go Pro",
    highlighted: true,
    features: [
      { label: "Unlimited projects" },
      { label: "Team collaboration (role-based access)" },
      { label: "Advanced analytics (performance, errors)" },
      { label: "Staging environments & preview deploys" },
      { label: "Optimized infrastructure (speed & scaling)" },
      { label: "Priority support (faster responses)" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    yearlyPrice: "Custom",
    priceNote: "Starts around $200+/mo",
    description:
      "For organizations needing SLAs, dedicated infrastructure, security, and white-label options.",
    ctaLabel: "Contact sales",
    features: [
      { label: "Custom SLAs (uptime & performance)" },
      { label: "Dedicated infrastructure (isolated, compliance-ready)" },
      { label: "Advanced security (SSO, audit logs, policies)" },
      { label: "Custom integrations (CI/CD, API access)" },
      { label: "Whitelabeling (brand Launchly as your own)" },
      { label: "Dedicated account manager & 24/7 premium support" },
    ],
  },
];

function PlanCard({ plan, isYearly }: { plan: Plan; isYearly: boolean }) {
  const displayPrice =
    isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
  const savings =
    plan.price !== "Custom" &&
    plan.yearlyPrice &&
    plan.yearlyPrice !== plan.price;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl transition-all duration-300 ${
        plan.highlighted
          ? "border-2 border-indigo-500 dark:border-indigo-400 shadow-2xl shadow-indigo-500/20 dark:shadow-indigo-400/20 scale-105"
          : "border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5"
      } bg-white dark:bg-gray-800 hover:-translate-y-1`}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
          ⭐ Most popular
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          {plan.name}
        </h3>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {displayPrice}
          </span>
          {displayPrice !== "Custom" && (
            <span className="text-lg text-gray-500 dark:text-gray-400">
              /mo
            </span>
          )}
        </div>
        {savings && isYearly && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Save 15% annually
          </div>
        )}
        {plan.priceNote && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {plan.priceNote}
          </p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {plan.description}
        </p>
      </div>

      <div className="px-8">
        <div className="h-px w-full bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
      </div>

      <ul className="flex-1 space-y-3 p-8 text-sm">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 group/item">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white shadow-sm">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span className="text-gray-700 dark:text-gray-200 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="p-8 pt-0">
        <button
          className={`group/btn relative w-full overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 ${
            plan.highlighted
              ? "bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-400/30 hover:shadow-xl hover:shadow-indigo-500/40 dark:hover:shadow-indigo-400/40 hover:scale-105"
              : "border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          }`}
        >
          <span className="relative z-10">{plan.ctaLabel}</span>
          {plan.highlighted && (
            <span className="absolute inset-0 z-0 bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 opacity-0 transition-opacity group-hover/btn:opacity-100" />
          )}
        </button>
        {plan.id !== "free" && plan.id !== "enterprise" && (
          <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            Prices per account. Usage-based add-ons available.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            Pricing
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Deploy websites effortlessly with one-click automatic deployments,
            SSL, and domains built in.
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {" "}
              Pick a plan that grows with you.
            </span>
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                !isYearly
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                isYearly
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-bold text-green-700 dark:text-green-300">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              ),
              title: "Automatic HTTPS",
              description:
                "Certificates are always valid—no manual renewal or maintenance.",
            },
            {
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
              title: "Instant deploys",
              description:
                "Push code → Launchly builds and deploys in isolated environments.",
            },
            {
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              ),
              title: "Real-time visibility",
              description:
                "Transparent build logs and environment isolation for every deploy.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <p className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
