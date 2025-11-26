import { getToken } from "next-auth/jwt";
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

export async function middleware(req: any) {
    const token = await getToken({ req });
    const path = req.nextUrl.pathname;

    // Admin routes must require admin role
    if (path.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Logged-in users should never see login/register
    if (path === "/login" || path === "/register") {
        if (token) {
            if (token.role === "admin") {
                return NextResponse.redirect(
                    new URL("/admin/dashboard", req.url)
                );
            }
            return NextResponse.redirect(new URL("/user", req.url));
        }
    }

    return NextResponse.next();
}

export const conf = {
    matcher: ["/admin/:path*", "/login", "/register"],
};
