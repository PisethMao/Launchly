export const runtime = "nodejs"; // MUST BE FIRST

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const email = session?.user?.email || null;

    // Read tempSessionId for guests
    const url = new URL(req.url);
    const tempSessionId = url.searchParams.get("tempSessionId");

    let user = null;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { deployments: true },
      });
    }

    // Enforce plan limits (Fake Billing)
    if (user) {
      const plan = user.plan ?? "free"; // default to free
      const deploymentCount = user.deployments.length;

      if (plan === "free" && deploymentCount >= 3) {
        return Response.json({
          deployments: user.deployments,
          limitReached: true,
          limit: 3,
          message:
            "Free plan limit reached. Upgrade to Pro for unlimited deployments.",
        });
      }
    }

    // Normal behavior (guest or pro)
    const deployments = await prisma.deployment.findMany({
      where: user
        ? { userId: user.id }
        : tempSessionId
        ? { tempSessionId }
        : {},
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ deployments, limitReached: false });
  } catch (err) {
    console.error("Error in /api/deployments/list: ", err);
    return Response.json(
      { deployments: [], limitReached: false, err: "Internal server error" },
      { status: 500 }
    );
  }
}
