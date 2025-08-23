import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const role = token?.role;

  const url = req.nextUrl.clone();

  // Special page for non-auth
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.some(path => req.nextUrl.pathname.startsWith(path));

  // Pages are restricted to certain roles
  const customerPages = ["/profile", "/myfarm"];
  const breederPages = ["/myfarm"];
  const adminPages = ["/dashboard"];

  // Redirect if already login but try push login/register page
  if (isAuthenticated && isAuthPage) {
    if (role === "ADMIN") url.pathname = "/dashboard";
    else if (role === "BREEDER") url.pathname = "/myfarm";
    else url.pathname = "/profile"; // CUSTOMER
    return NextResponse.redirect(url);
  }

  // Redirect if not logged in but page access is limited
  const limitedPages = [...customerPages, ...breederPages, ...adminPages];
  if (!isAuthenticated && limitedPages.some(path => req.nextUrl.pathname.startsWith(path))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based access
  if (isAuthenticated) {
    if (req.nextUrl.pathname.startsWith("/dashboard") && role !== "ADMIN") {
      url.pathname = role === "BREEDER" ? "/myfarm" : "/profile";
      return NextResponse.redirect(url);
    }
    if (req.nextUrl.pathname.startsWith("/myfarm") && role !== "BREEDER") {
      url.pathname = role === "ADMIN" ? "/dashboard" : "/profile";
      return NextResponse.redirect(url);
    }
    if (req.nextUrl.pathname.startsWith("/profile") && role !== "CUSTOMER") {
      url.pathname = role === "BREEDER" ? "/myfarm" : "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// path run middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/myfarm/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
