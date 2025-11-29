import {
  BsLightningCharge,
  BsGlobe2,
  BsDatabaseLock,
  BsArrowRepeat,
  BsBank,
  BsShieldCheck,
} from "react-icons/bs";
const features = [
  {
    icon: <BsLightningCharge />,
    title: "One-Click Deployments",
    desc: "Push code → Launchly instantly deploys your site. No servers, configs, or DevOps required.",
  },
  {
    icon: <BsGlobe2 />,
    title: "Automatic HTTPS Certificates",
    desc: "Every domain gets a valid SSL certificate automatically. No renewals, no maintenance, always secure.",
  },
  {
    icon: <BsDatabaseLock />,
    title: "Custom Domains Built-In",
    desc: "Connect your brand with ease. Launchly handles DNS and SSL so your site is live in minutes.",
  },
  {
    icon: <BsArrowRepeat />,
    title: "Real-Time Build Logs",
    desc: "Watch deployments as they happen. Transparent logs give you confidence and visibility.",
  },
  {
    icon: <BsBank />,
    title: "Isolated Environments",
    desc: "Every deploy runs in its own environment, ensuring reliability and zero interference.",
  },
  {
    icon: <BsShieldCheck />,
    title: "Fast & Reliable Infrastructure",
    desc: "Optimized for speed and uptime. Your sites scale automatically without extra configuration.",
  },
];

export default function Feature() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Features that make <span className="text-indigo-600">Launchly</span>{" "}
          effortless
        </h2>
        <p className="mt-3 text-gray-600">
          Deploy websites in seconds with built-in SSL, domains, and real-time
          visibility.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex gap-5">
              <div className="bg-indigo-600 text-white rounded-lg h-fit text-[27px] p-2">
                <div>{feature.icon}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
