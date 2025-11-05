import { GitBranch, Globe, Rocket } from "lucide-react";

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Connect Your Repository",
    desc: "Link GitHub or GitLab. No YAML gymnastics-Launchly reads your project and prepairs the build.",
    Icon: GitBranch,
  },
  {
    id: 2,
    title: "Launch Deployment",
    desc: "Kick off a build in one click. We install deps, build, containerize, and provision infra for you.",
    Icon: Rocket,
  },
  {
    id: 3,
    title: "Go Live with SSL",
    desc: "Instant subdomain with HTTPS. Get a shareable URL, logs, and one-click redeploys.",
    Icon: Globe,
  },
];
