import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("🔵 /api/admin/login HIT");

    const { email, password } = await req.json();
    console.log("📥 Login payload:", email);

    const admin = await prisma.user.findUnique({ where: { email } });
    console.log("👤 Admin found?", !!admin);

    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 401 });
    if (admin.role !== "ADMIN") return NextResponse.json({ error: "Not admin" }, { status: 403 });

    const valid = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password valid?", valid);

    if (!valid) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

    const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    console.log("🔑 JWT created:", token.substring(0, 20) + "...");

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin-token", token, {
        httpOnly: false, // <-- FORCE visible cookie for debugging
        secure: false,   // <-- MUST be false on localhost
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    console.log("🍪 Cookie attached!");

    return res;
}
