// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   // Public paths that don't require authentication
//   const publicPaths = ["/login"];

//   // Check if path is public
//   const isPublicPath = publicPaths.includes(path);

//   // Get auth token from cookies
//   const token = request.cookies.get("auth_token")?.value;

//   // If no token and trying to access protected path, redirect to login
//   if (!token && !isPublicPath) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

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

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const tokenExists = req.cookies.has("auth_token");
  const url = req.nextUrl.clone();

  const publicRoutes = ["/login"];

  // Allow public routes
  if (publicRoutes.includes(url.pathname)) {
    if (tokenExists && url.pathname === "/login") {
      // Redirect logged-in users away from login
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Block protected routes
  if (!tokenExists) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
