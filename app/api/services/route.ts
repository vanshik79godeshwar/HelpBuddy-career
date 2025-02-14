// app/api/services/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect';
import Service from '../../../models/Service';
import { getWorkerIdFromToken } from '../../../lib/authUtils';

export async function GET(request: Request) {
  try {
    await connectDB();

    // Extract worker ID from token
    const workerId = getWorkerIdFromToken(request);
    if (!workerId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Fetch services for the worker
    const services = await Service.find({ workerId }).lean();
    console.log("worker id from route.ts",workerId);
    console.log("service from route.ts",services);
    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}