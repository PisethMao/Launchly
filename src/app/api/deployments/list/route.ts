export const runtime = "nodejs"; // <-- MUST BE FIRST

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  const email = session?.user?.email || null;

  // Read tempSessionId from query (for guests)
  const url = new URL(req.url);
  const tempSessionId = url.searchParams.get("tempSessionId");

  let user = null;
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  }

  const deployments = await prisma.deployment.findMany({
    where: user ? { userId: user.id } : tempSessionId ? { tempSessionId } : {},
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ deployments });
}