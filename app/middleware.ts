import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  '/auth', '/auth/create', '/auth/forgot-password', '/auth/confirm-email',
  '/legal/terms', '/privacy/policy', '/privacy/policies/cookies',
];

const adminRoutes = [
  '/manager',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const userProfile = request.cookies.get('user_profile')?.value;
  const { pathname } = request.nextUrl;

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));   
  }

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/books', request.url));  
  }

  if (adminRoutes.includes(pathname) && userProfile !== 'Administrador') {
    return NextResponse.redirect(new URL('/books', request.url));  
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', '/auth', '/books', '/auth/create',
    '/auth/forgot-password', '/auth/confirm-email', '/manager',
    '/company', '/legal/terms', '/privacy/policy', 
    '/privacy/policies/cookies',
  ],
};
