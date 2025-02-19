// app/api/worker/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Worker from '@/models/Worker'; // Adjust the path as needed

export async function GET(request: NextRequest) {
  try {
    const workerId = request.nextUrl.searchParams.get('workerId');

    if (!workerId) {
      return NextResponse.json({ message: 'workerId is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return NextResponse.json({ message: 'Invalid workerId' }, { status: 400 });
    }

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json(worker);
  } catch (error) {
    console.error('Error fetching worker:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}