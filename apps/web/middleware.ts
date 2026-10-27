import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // --- Protected routes: require login ---
  if (pathname.startsWith('/app')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Auth routes: redirect if already logged in ---
  if (pathname === '/login' || pathname === '/signup') {
    if (user) {
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, site.webmanifest (static files)
     * - /auth/callback (OAuth callback, must be public)
     * - /api/waitlist (public form endpoint)
     */
    '/((?!_next/static|_next/image|favicon|site.webmanifest|auth/callback|api/waitlist).*)',
  ],
};
