import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Routes protégées
  const protectedRoutes = ['/dashboard', '/api/products', '/api/ads', '/api/keywords', '/api/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    // Rediriger vers la page d'authentification
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à /auth, rediriger vers /dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Ajouter l'ID utilisateur aux headers pour les routes API
  if (session && req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('x-user-id', session.user.id)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/products/:path*',
    '/api/ads/:path*',
    '/api/keywords/:path*',
    '/api/dashboard/:path*'
  ],
}