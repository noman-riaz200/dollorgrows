export default function middleware() {
  // Middleware handled by NextAuth
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
