import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes - in this case, everything not explicitly public
// Based on your current publicRoutes, it looks like you want to protect everything except 
// the homepage, shop pages, webhooks, and product API
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)', 
  '/dashboard(.*)',
  // Add any other protected routes here
  // This is the inverse of your previous publicRoutes list
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

