/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
    const admin = verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { name, email, password, plan, role } = await req.json();

    const data: any = { name, email, plan, role };

    if (password) {
        data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
        where: { id: params.id },
        data,
    });

    return NextResponse.json(user);
}

export async function DELETE(req: Request, { params }: any) {
    const admin = verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await prisma.user.delete({
        where: { id: params.id },
    });

    return NextResponse.json({ success: true });
}
