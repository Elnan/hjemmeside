import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/games", "/api/contact"],
});

export const config = {
  matcher: ["/dailys/:path*"],
};
