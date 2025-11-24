import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const publicPaths = ["/", "/signup"];
  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // If user is trying to access protected page without token → redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// This ensures the middleware runs for all routes except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
