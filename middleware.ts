import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ['/', '/explore', '/sign-in', '/sign-up', '/api/webhook/clerk', '/api/auth/sync']

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname
  
  // Allow public routes
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  const { userId, sessionId } = await auth()
  
  // If the route is not public and user isn't authenticated
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}