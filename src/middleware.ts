import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Example basic route guarding logic:
  
  // 1. Developer Console
  if (request.nextUrl.pathname.startsWith('/developer-console') && request.nextUrl.pathname !== '/developer-console') {
     if (!user) {
         url.pathname = '/developer-console'
         return NextResponse.redirect(url)
     }
     // In a real app, also fetch user_profile role to ensure role === 'developer'
  }

  // 2. Admin Portal
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin-login') {
      if (!user) {
          url.pathname = '/admin-login'
          return NextResponse.redirect(url)
      }
      // Check role IN ('operations', 'super_admin', 'accounts')
  }

  // 3. Customer Portal (Dashboard)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!user) {
          url.pathname = '/login' // Assuming a /login exists on public portal
          return NextResponse.redirect(url)
      }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
