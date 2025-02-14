// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Worker from '../../../../models/Worker';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password }: { email: string; password: string } = await request.json();

  try {
    await connectDB();

    // Find worker by email
    const worker = await Worker.findOne({ email });
    console.log('Worker not found checking....', worker);
    if (!worker) return NextResponse.json({ message: 'Worker not found' }, { status: 404 });

    // Check if worker is verified
    console.log('Worker is not verified....', worker.isVerified);
    if (!worker.isVerified) {
      return NextResponse.json({ message: 'Please verify your email first' }, { status: 400 });
    }

    // Compare passwords
    console.log('Comparing passwords....');
    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });

    // Generate JWT token with 1-day expiration
    console.log('Worker logged in:', worker.email);
    const token = jwt.sign(
      { workerId: worker._id, email: worker.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}