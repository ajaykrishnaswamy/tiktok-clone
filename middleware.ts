import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public and protected routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/explore', 
  '/sign-in', 
  '/sign-up',
  '/api/webhook/clerk'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // For public routes, allow access
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // If user isn't signed in and trying to access protected route
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // If accessing API routes, sync user data
  if (userId && req.nextUrl.pathname.startsWith('/api/')) {
    try {
      await fetch(`${req.nextUrl.origin}/api/auth/sync`, {
        method: 'POST',
        headers: {
          Authorization: req.headers.get('Authorization') || '',
        },
      })
    } catch (error) {
      console.error('User sync failed:', error)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Include all API routes
    '/api/:path*',
    // Include studio routes
    '/studio/:path*'
  ],
}