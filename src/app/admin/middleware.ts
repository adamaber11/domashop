import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // If the user is trying to access /admin, redirect them to /admin/dashboard
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin',
};
