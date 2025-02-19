// app/api/gwoc-career/complete-service/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import ServiceRequest from '@/models/ServiceRequest';
import ServiceCompletion from '@/models/ServiceCompletion';

export async function POST(request: Request) {
  let { serviceRequestId, completionPhoto } = await request.json();

  try {
    await connectDB();

    serviceRequestId = serviceRequestId.trim();

    if(!completionPhoto){
        completionPhoto = 'https://via.placeholder.com/150';
    }

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    console.log("serviceRequest", serviceRequest);
    if (!serviceRequest) return NextResponse.json({ message: 'Service request not found' }, { status: 404 });

    if (serviceRequest.status !== 'accepted') return NextResponse.json({ message: 'Service request is not accepted' }, { status: 400 });

    const serviceCompletion = new ServiceCompletion({
      serviceRequestId,
      completionStatus: 'completed',
      completionPhoto,
    });
    await serviceCompletion.save();

    serviceRequest.status = 'completed';
    await serviceRequest.save();

    return NextResponse.json({ message: 'Service marked as completed' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}