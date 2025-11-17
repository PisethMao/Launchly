/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";

export function verifyAdmin(request: Request) {
    const cookie = request.headers.get("cookie");
    if (!cookie) return null;

    const token = cookie.match(/admin-token=([^;]+)/)?.[1];
    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== "ADMIN") return null;

        return decoded;
    } catch {
        return null;
    }
}
