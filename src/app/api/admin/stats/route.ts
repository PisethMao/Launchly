import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: Request) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.deployment.count();
    const activeDeployments = await prisma.deployment.count({
        where: { status: "running" },
    });

    return NextResponse.json({
        totalUsers,
        totalProjects,
        activeDeployments,
    });
}
