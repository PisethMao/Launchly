import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
    const admin = await verifyAdmin();
    if (!admin)
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 403 }
        );

    const users = await prisma.user.findMany({
        include: { deployments: true },
    });

    return NextResponse.json(users);
}
