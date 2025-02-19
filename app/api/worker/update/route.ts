// app/api/worker/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Worker from '@/models/Worker'; // Adjust the path as needed

export async function PUT(request: NextRequest) {
  try {
    const { fullName, email, mobileNumber, image } = await request.json();
    const workerId = request.cookies.get('workerId')?.value;

    if (!workerId) {
      return NextResponse.json({ message: 'workerId is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return NextResponse.json({ message: 'Invalid workerId' }, { status: 400 });
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { fullName, email, mobileNumber, image },
      { new: true }
    );

    if (!updatedWorker) {
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json(updatedWorker);
  } catch (error) {
    console.error('Error updating worker:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}