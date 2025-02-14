// middleware.ts
import { NextResponse } from 'next/server';

export async function middleware(request: any) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('No token found. Redirecting to /login.');
    return NextResponse.redirect(new URL('/login?message=Session+Expired', request.url));
  }

  try {
    // Verify token by sending it to the backend
    const response = await fetch(`${request.nextUrl.origin}/api/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.log("data from middleware", data);
    if (data.valid) {
      return NextResponse.next(); // Allow access to the protected route
    } else {
      console.log('Invalid or expired token. Redirecting to /login.');

      return NextResponse.redirect(new URL('/login?message=Session+Expired', request.url));
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.redirect(new URL('/login?message=Session+Expired', request.url));
  }
}

export const config = {
  matcher: ['/dashboard'], // Protect specific routes
};