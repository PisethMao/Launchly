/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyAdmin(request: Request) {
    const cookieStore = await cookies();   // <-- REQUIRED in your version
    const cookie = cookieStore.get("admin-token");

    if (!cookie) return null;

    try {
        const decoded: any = jwt.verify(cookie.value, process.env.JWT_SECRET!);

        if (decoded.role !== "ADMIN") return null;

        return decoded;
    } catch (err) {
        console.error("JWT verify error:", err);
        return null;
    }
}
