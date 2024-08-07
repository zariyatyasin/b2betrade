import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const origin = req.nextUrl.origin;

  if (req.nextUrl.pathname.startsWith("/checkout")) {
    if (!session) {
      return NextResponse.redirect(new URL(origin, req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/order")) {
    if (!session) {
      return NextResponse.redirect(new URL(origin, req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith("/editproduct")) {
    if (!session) {
      return NextResponse.redirect(new URL(origin, req.url));
    }

    // Check if the user's role is "admin", "supplier", or "manufacturer"
    if (
      session.role !== "admin" &&
      session.role !== "supplier" &&
      session.role !== "manufacturer"
    ) {
      return NextResponse.redirect(new URL(origin, req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith("/profile")) {
    if (!session) {
      return NextResponse.redirect(new URL(origin, req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (session.role !== "admin")
      return NextResponse.redirect(new URL("/", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/supplier")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (session.role !== "supplier")
      return NextResponse.redirect(new URL("/", req.url));
  }
}
