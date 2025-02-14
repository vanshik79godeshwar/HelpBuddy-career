// app/api/services/add/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Service from '../../../../models/Service';
import { getWorkerIdFromToken } from '../../../../lib/authUtils';

export async function POST(request: Request) {
  const { title, category, place, description, price, duration, images }: any = await request.json();

  try {
    await connectDB();

    // Extract worker ID from token
    const workerId = getWorkerIdFromToken(request);
    if (!workerId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Create new service
    const service = new Service({
      workerId,
      title,
      category,
      place,
      description,
      price,
      duration,
      images,
      isApproved: false, // Default to false (admin approval required)
    });
    await service.save();

    return NextResponse.json({ message: 'Service added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}