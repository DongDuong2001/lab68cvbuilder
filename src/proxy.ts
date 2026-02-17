export { auth as proxy } from "@/auth";

/**
 * Proxy configuration — only runs on protected routes.
 * Public routes (/, /login, etc.) are excluded to avoid JWT
 * decryption errors when no session exists.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/resumes/:path*",
    "/api/export/:path*",
  ],
};
