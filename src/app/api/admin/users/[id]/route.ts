/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";

// GET /api/admin/users/:id
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    const admin = await verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

// PATCH /api/admin/users/:id
export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    const admin = await verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();

    const updated = await prisma.user.update({
        where: { id },
        data: body,
    });

    return NextResponse.json(updated);
}
