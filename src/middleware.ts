import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/login"];

  // Check if path is public
  const isPublicPath = publicPaths.includes(path);

  // Get auth token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // If no token and trying to access protected path, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:png|jpg|jpeg|svg|webp|ico)).*)",
  ],
};
