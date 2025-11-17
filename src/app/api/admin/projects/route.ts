import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: Request) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const deployments = await prisma.deployment.findMany({
        include: {
            user: true,
        },
    });

    return NextResponse.json(deployments);
}
