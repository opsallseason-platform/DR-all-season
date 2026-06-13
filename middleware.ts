import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Exclude admin routes from i18n middleware - they don't need locale prefix
  if (pathname.startsWith('/admin')) {
    // Admin routes protection (except login page)
    if (!pathname.startsWith('/admin/login')) {
      const sessionToken = request.cookies.get('admin_session')?.value;

      if (!sessionToken) {
        // No session, redirect to login
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      // Verify session is valid
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/admin/session/verify`, {
          headers: {
            Cookie: `admin_session=${sessionToken}`,
          },
        });

        if (!response.ok) {
          const loginUrl = new URL('/admin/login', request.url);
          return NextResponse.redirect(loginUrl);
        }
      } catch {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Let admin routes through without i18n processing
    return NextResponse.next();
  }

  // Run i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)'] 
};
