/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const admin = verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const deployments = await prisma.deployment.findMany({
        include: {
            user: true,
        },
    });

    return NextResponse.json(deployments);
}

export async function DELETE(req: Request, { params }: any) {
    const admin = verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const dep = await prisma.deployment.findUnique({
        where: { id: Number(params.id) },
    });

    if (!dep) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const dir = `/var/www/${dep.subdomain}`;

    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }

    await prisma.deployment.delete({
        where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
}
