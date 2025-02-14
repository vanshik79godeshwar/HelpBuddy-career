// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Worker from "../../../../models/Worker";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, otp }: { email: string; otp: string } = await request.json();

  try {
    await connectDB();

    // Find worker by email
    console.log("email : ", email);
    const worker = await Worker.findOne({ email });
    if (!worker) {
        console.log("Worker not founddddd");
        return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    // Check OTP validity
    if (worker.otp !== otp || worker.otpExpires! < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Mark worker as verified
    worker.isVerified = true;
    worker.otp = undefined;
    worker.otpExpires = undefined;
    await worker.save();

    // Generate JWT token
    const token = jwt.sign({ workerId: worker._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return NextResponse.json({ message: 'Email verified successfully', token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}