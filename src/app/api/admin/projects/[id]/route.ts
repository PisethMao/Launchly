/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyAdmin } from "@/lib/adminAuth";
import prisma from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function DELETE(req: Request, { params }: any) {
    const admin = verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const project = await prisma.project.findUnique({
        where: { id: Number(params.id) },
    });

    if (!project)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove folder from server (e.g., /var/www/project.piseth.space)
    const dir = `/var/www/${project.domain}`;
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }

    await prisma.project.delete({
        where: { id: project.id },
    });

    return NextResponse.json({ success: true });
}
