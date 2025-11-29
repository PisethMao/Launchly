// src/app/api/deployments/create/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Provider = "github" | "gitlab";

interface CreateDeploymentBody {
  repoUrl: string;
  branch: string;
  provider: Provider;
  projectName: string;
}

// turn "Blah Blah" into "blah-blah"
function toSubdomain(name: string): string {
  const cleaned =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-") // only letters / numbers / hyphen
      .replace(/^-+|-+$/g, "") || "project";

  // you could also add a random suffix here if you’re afraid of collisions
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse body
    const body = (await req.json()) as Partial<CreateDeploymentBody>;
    const { repoUrl, branch, provider, projectName } = body;

    if (!repoUrl || !branch || !provider || !projectName) {
      return NextResponse.json(
        { error: "repoUrl, branch, provider and projectName are required." },
        { status: 400 }
      );
    }

    // 2. Get session + user
    const session = (await getServerSession(authOptions)) as Session | null;
    const email = session?.user?.email ?? null;

    const url = req.nextUrl;
    const tempSessionId = url.searchParams.get("tempSessionId") ?? null;

    let userId: string | null = null;
    let plan: string | null = null;

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { deployments: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found for current session." },
          { status: 401 }
        );
      }

      userId = user.id;
      plan = user.plan ?? "free";

      // 3. Enforce fake billing limit here as well (defence in depth)
      const deploymentCount = user.deployments.length;
      if (plan === "free" && deploymentCount >= 3) {
        return NextResponse.json(
          {
            error:
              "Free plan limit reached. Upgrade to Pro for unlimited deployments.",
          },
          { status: 403 }
        );
      }
    }

    // 4. Build subdomain + liveUrl from projectName + DEPLOY_DOMAIN
    const subdomain = toSubdomain(projectName);
    const deployDomain = process.env.DEPLOY_DOMAIN ?? "localhost";
    const liveUrl = `https://${subdomain}.${deployDomain}`;

    // 5. Create deployment row
    const deployment = await prisma.deployment.create({
      data: {
        repoUrl,
        subdomain,
        port: null, // you'll update this when your VM static server has a port
        buildPath: "/", // adjust if you support custom build paths
        projectType: "static", // or "nextjs" / etc. if you add types
        status: "queued", // initial status
        liveUrl,
        projectName,
        userId,
        tempSessionId: userId ? null : tempSessionId,
      },
    });

    // 6. (Optional) kick off your real deployment pipeline here.
    // For example: enqueue a job / call a separate API / spawn a script.
    //
    // You ALREADY have that logic working earlier, so just re-use whatever
    // you had before, but now you also have:
    //   - deployment.id
    //   - deployment.subdomain
    //   - deployment.liveUrl
    // to pass into your script / VM.
    //
    // Example placeholder (DON'T forget to replace with your real thing):
    // triggerDeploymentOnVm({
    //   repoUrl,
    //   branch,
    //   provider,
    //   subdomain,
    //   projectName,
    //   deploymentId: deployment.id,
    // });

    return NextResponse.json(
      {
        deployment,
        liveUrl,
        subdomain,
        message: "Deployment created successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/deployments/create:", err);
    return NextResponse.json(
      { error: "Internal server error while creating deployment." },
      { status: 500 }
    );
  }
}
