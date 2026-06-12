import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/proxy'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run proxy middleware on routes that require authentication checks:
     * - /admin and all sub-routes (protected dashboard)
     * - /login (to redirect authenticated users away)
     *
     * All other routes (/, /about, /contact, /gallery, etc.) are public
     * and do NOT need a Supabase auth call, so we skip them entirely to
     * prevent MIDDLEWARE_INVOCATION_TIMEOUT on Vercel Edge.
     */
    '/admin/:path*',
    '/login',
  ],
}
