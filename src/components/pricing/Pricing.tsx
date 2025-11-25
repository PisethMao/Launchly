type Feature = { label: string };
type Plan = {
  id: "free" | "starter" | "pro" | "enterprise";
  name: string;
  price: string;
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
    price: "$12/mo",
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
    price: "$40/mo",
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
    priceNote: "Starts around $200+/mo",
    description:
      "For organizations needing SLAs, dedicated infrastructure, security, and white-label options.",
    ctaLabel: "Contact sales",
    features: [
      { label: "Custom SLAs (uptime & performance)" },
      { label: "Dedicated infrastructure (isolated, compliance-ready)" },
      { label: "Advanced security (SSO, audit logs, policies)" },
      { label: "Custom integrations (CI/CD, API access)" },
      { label: "White-labeling (brand Launchly as your own)" },
      { label: "Whitelabeling (brand Launchly as your own)" },
      { label: "Dedicated account manager & 24/7 premium support" },
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border hover:transition-transform hover:scale-105 hover:duration-300 ${
        plan.highlighted
          ? "border-gray-200 shadow-xl shadow-black/5"
          ? "border-black/10 shadow-xl shadow-black/5"
          : "border-gray-200"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl text-indigo-600 font-semibold tracking-tight">
          {plan.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl text-red-600 font-bold">{plan.price}</span>
          {plan.priceNote && (
            <span className="text-xs text-gray-600">{plan.priceNote}</span>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
      </div>

      <div className="px-6">
        <div className="h-px w-full bg-gray-200" />
      </div>

      <ul className="grid gap-3 p-6 text-sm">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-4 w-4 p-2 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              ✓
            </span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto p-6">
        <button
          className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer ${
            plan.highlighted
              ? "bg-indigo-600 text-white hover:bg-indigo-500"
              : "border border-gray-300 text-black hover:bg-indigo-500 hover:text-white"
          }`}
        >
          {plan.ctaLabel}
        </button>
        {/* Optional: tiny usage disclaimers or overage details */}
        {plan.id !== "free" && plan.id !== "enterprise" && (
          <p className="mt-2 text-xs text-gray-500">
            Prices are per account, not per seat. Usage-based add-ons available.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
        <p className="mt-3 text-gray-600">
          Deploy websites effortlessly with one-click automatic deployments,
          SSL, and domains built in. Pick a plan that grows with you.
        </p>
      </div>

      {/* Optional: monthly / yearly switcher (non-functional placeholder) */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 p-1 text-xs">
          <button className="rounded-full px-3 py-1 font-semibold bg-indigo-600 text-white">
            Monthly
          </button>
          <button className="rounded-full px-3 py-1 text-gray-500 hover:bg-gray-50">
            Yearly (
            <span className="text-red-600 font-bold italic">save 15%</span>)
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Trust markers / notes */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4 text-sm">
          <p className="font-semibold">Automatic HTTPS</p>
          <p className="mt-1 text-gray-600">
            Certificates are always valid—no manual renewal or maintenance.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-sm">
          <p className="font-semibold">Instant deploys</p>
          <p className="mt-1 text-gray-600">
            Push code → Launchly builds and deploys in isolated environments.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-sm">
          <p className="font-semibold">Real-time visibility</p>
          <p className="mt-1 text-gray-600">
            Transparent build logs and environment isolation for every deploy.
          </p>
        </div>
      </div>
    </section>
  );
}