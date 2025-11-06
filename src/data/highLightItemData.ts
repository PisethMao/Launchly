import { GlobeLock, Settings, ShieldCheck, Zap } from "lucide-react";

export const FEATURES: Feature[] = [
  {
    title: "Automatic SSL Certificates",
    desc: "Every site gets HTTPS automatically - no certificate setup, no expiration headaches.",
    Icon: GlobeLock,
  },
  {
    title: "Isolated Build Environments",
    desc: "Each deployment runs in its own secure sandbox. No shared state, no surprices.",
    Icon: ShieldCheck,
  },
  {
    title: "One-Click Redeploy",
    desc: "Update your site instantly. Push to main → Launchly Redeploys.",
    Icon: Zap,
  },
  {
    title: "Smart Configuration",
    desc: "We detect static, Node, React, Veu, Svelte, Next.js builds - zero config required.",
    Icon: Settings,
  },
];
