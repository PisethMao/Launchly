export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/user/:path*",
    "/deploy/:path*",
    "/billing/:path*",
    "/logs/:path*",
  ],
};
