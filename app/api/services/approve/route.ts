// app/api/services/approve/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Service from '../../../../models/Service';

export async function POST(request: Request) {
  const { serviceId }: { serviceId: string } = await request.json();

  console.log('Received serviceId:', serviceId); // Debugging log

  try {
    await connectDB();

    // Find the service by ID and update its `isApproved` field
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { isApproved: true },
      { new: true } // Return the updated document
    );

    console.log('Updated Service:', updatedService); // Debugging log

    if (!updatedService) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service approved successfully', service: updatedService }, { status: 200 });
  } catch (error) {
    console.error('Error approving service:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}