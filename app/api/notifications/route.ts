// app/api/gwoc-career/notifications/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import ServiceRequest from '@/models/ServiceRequest';
import Worker from '@/models/Worker';
import Service from '@/models/Service';
import { URL } from 'url';

export async function GET(request: Request) {

  const url = new URL(request.url);
  const workerId = url.searchParams.get('workerId');
  console.log("notification route called");

  if (!workerId) {
    return NextResponse.json({ message: 'Worker ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    const worker = await Worker.findById(workerId);
    if (!worker) return NextResponse.json({ message: 'Worker not found' }, { status: 404 });

    // Fetch all services created by the worker
    const services = await Service.find({ workerId: worker._id });
    // Extract categories from the worker's services
    const categories = services.map((service) => service.category);
    console.log(categories);

    // Fetch pending service requests for the worker's categories
    const serviceRequests = await ServiceRequest.find({
      category: { $in: categories },
      status: 'pending',
    });
    console.log("flag");
    console.log(serviceRequests);
    return NextResponse.json(serviceRequests, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}