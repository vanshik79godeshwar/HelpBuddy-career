// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Worker from '../../../../models/Worker';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { fullName, email, mobileNumber, password }: { fullName: string; email: string; mobileNumber: string; password: string } =
    await request.json();

  try {
    await connectDB();

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) return NextResponse.json({ message: 'Worker already exists' }, { status: 400 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save worker with OTP
    const worker = new Worker({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
      isApproved: false,
    });
    await worker.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: 'Verify Your Email - Worker Portal',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent to email' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}