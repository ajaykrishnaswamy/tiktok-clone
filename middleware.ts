import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Remove '/' from public paths since we want to protect the home page
const publicPaths = ['/explore', '/sign-in', '/sign-up', '/api/webhook/clerk', '/api/auth/sync', '/onboarding']

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname
  const res = NextResponse.next()
  
  // Allow public routes
  if (publicPaths.includes(path)) {
    return res
  }

  const { userId, sessionId } = await auth()
  
  // If the route is not public and user isn't authenticated
  if (!userId) {
    console.log('User not authenticated, redirecting to sign-in')
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check if user has completed onboarding
  const supabase = createMiddlewareClient({ req, res })
  const { data: preferences, error: preferencesError } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (preferencesError) {
    console.error('Error fetching preferences:', preferencesError)
  }

  // If user hasn't completed onboarding and isn't on the onboarding page
  if (!preferences && path !== '/onboarding') {
    console.log('User needs onboarding, redirecting to onboarding page')
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  return res
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}