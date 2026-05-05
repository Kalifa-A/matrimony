import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /* 
  // 1. Protect Admin Routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      // Not logged in -> Redirect to admin login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect authenticated admins away from login page
  if (pathname === '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 2. Protect User Routes (Dashboard, Profile, etc.)
  const userProtectedPaths = ['/dashboard', '/profile', '/my-account', '/search'];
  const isUserPath = userProtectedPaths.some(path => pathname.startsWith(path));

  if (isUserPath) {
    const userToken = request.cookies.get('user_token')?.value;
    if (!userToken) {
      // Not logged in -> Redirect to user login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*', '/my-account/:path*', '/search/:path*'],
};
