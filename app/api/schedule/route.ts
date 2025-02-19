// app/api/gwoc-career/schedule/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import ServiceRequest from '@/models/ServiceRequest'; // Ensure ServiceRequest model is imported

export async function GET(request: Request) {
  const url = new URL(request.url);
  const workerId = url.searchParams.get('workerId');

  if (!workerId) {
    return NextResponse.json({ message: 'Worker ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    // Fetch accepted service requests for the worker
    const serviceRequests = await ServiceRequest.find({
      serviceProviderId: workerId,
      status: 'accepted',
    }).populate('userId', 'username'); // Populate the user's full name

    return NextResponse.json(serviceRequests, { status: 200 });
  } catch (error) {
    console.error(error);
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}