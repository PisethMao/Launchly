import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const admin = await prisma.user.findUnique({ where: { email } });
    if (!admin)
        return NextResponse.json({ error: "Admin not found" }, { status: 401 });

    if (admin.role !== "ADMIN")
        return NextResponse.json({ error: "Not an admin" }, { status: 403 });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
        return NextResponse.json(
            { error: "Incorrect password" },
            { status: 401 }
        );

    const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    return res;
}
