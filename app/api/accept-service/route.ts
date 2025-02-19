// app/api/gwoc-career/accept-service/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import ServiceRequest from '@/models/ServiceRequest';
import User from '@/models/User';
import sendEmail from '@/lib/sendEmail';

export async function POST(request: Request) {
  const { requestId, workerId } = await request.json();

  try {
    await connectDB();

    const serviceRequest = await ServiceRequest.findById(requestId);
    if (!serviceRequest) return NextResponse.json({ message: 'Service request not found' }, { status: 404 });

    if (serviceRequest.status !== 'pending') return NextResponse.json({ message: 'Service request already processed' }, { status: 400 });

    serviceRequest.status = 'accepted';
    serviceRequest.serviceProviderId = workerId;
    await serviceRequest.save();

    const user = await User.findById(serviceRequest.userId);
    if (user) {
      const notificationUrl = `${process.env.NEXTAUTH_URL}/gwoc`;
      await sendEmail({
        to: user.email,
        subject: 'Service Request Accepted',
        text: `Your service request has been accepted by a service provider. Please check it out: ${notificationUrl}`,
      });
    }

    return NextResponse.json({ message: 'Service request accepted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}