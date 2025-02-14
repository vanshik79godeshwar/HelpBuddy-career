// app/api/worker/approve/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Worker from '../../../../models/Worker';

export async function POST(request: Request) {
  const { email }: { email: string } = await request.json();
  console.log("this route is called....");
  try {
    await connectDB();

    // Find worker by email
    const worker = await Worker.findOne({ email });
    if (!worker) {
      console.log("Worker not found");    
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
  }

    // Approve worker
    worker.isApproved = true;
    await worker.save();

    return NextResponse.json({ message: 'Worker approved successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}