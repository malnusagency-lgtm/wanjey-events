import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Guard: if Supabase env vars are not configured (e.g. missing in Vercel
  // environment settings), skip the auth check entirely rather than hanging
  // on a network request to an undefined host and triggering a timeout.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[proxy] Supabase env vars are not set – skipping auth check.')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    // If the Supabase API is unreachable or times out, log the error and
    // continue without authentication context rather than crashing the request.
    console.error('[proxy] supabase.auth.getUser() failed:', err)
    return supabaseResponse
  }

  // Helper: copy any refreshed session cookies onto a redirect response so
  // they are not lost (Supabase may refresh the token on every request).
  function redirectWithCookies(url: URL) {
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    // No authenticated user — send to login page.
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return redirectWithCookies(url)
  }

  // If user is logged in and on /login with no error param, redirect to admin.
  // We check for no ?error= to avoid a redirect loop after a failed login attempt
  // where the server action redirects back to /login?error=... and the proxy
  // would immediately bounce them to /admin if a stale cookie is present.
  const hasError = request.nextUrl.searchParams.has('error')
  if (user && request.nextUrl.pathname === '/login' && !hasError) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return redirectWithCookies(url)
  }

  return supabaseResponse
}
