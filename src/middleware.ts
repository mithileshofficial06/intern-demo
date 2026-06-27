import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith("/auth")
  const isApiAuthRoute = pathname.startsWith("/api/auth")
  const isPublicApiRoute = pathname === "/api/runtime/register"
  const isHome = pathname === "/"

  // Always allow auth pages and public API routes
  if (isAuthPage || isApiAuthRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // Home page ("/") — if already logged in, redirect to dashboard
  if (isHome) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  // Protect all other routes (including /editor)
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
