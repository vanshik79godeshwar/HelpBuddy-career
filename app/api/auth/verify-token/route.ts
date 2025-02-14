// app/api/auth/verify-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { token }: { token: string } = await request.json();
  console.log("flag flag flag");
  console.log("api/auth/verify-token/route.ts: token", token);

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Return success response with user data
    console.log("api/auth/verify-token/route.ts: decoded", decoded);
    return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
  } catch (error) {
    // Return failure response if token is invalid or expired
    console.log("api/auth/verify-token/route.ts: error", error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}