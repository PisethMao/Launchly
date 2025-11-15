import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
export { default } from "next-auth/middleware";
export const config = {
    matcher: [
        "/user/:path*",
        "/deploy/:path*",
        "/billing/:path*",
        "/logs/:path*",
    ],
};


export function middleware(req: any) {
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
        const token = req.cookies.get("admin-token");
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return NextResponse.next();
}
