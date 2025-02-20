// app/api/services/add/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import Service from '../../../../models/Service';
import { getWorkerIdFromToken } from '../../../../lib/authUtils';

interface serv {
  title: string;
  category: string;
  place: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
}

export async function POST(request: Request) {
  const body: serv = await request.json();

  try {
    
    await connectDB();

    // Extract worker ID from token
    const workerId = getWorkerIdFromToken(request);
    if (!workerId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Create new service
    const service = new Service({
      workerId,
      title: body.title,
      category: body.category,
      place: body.place,
      description: body.description,
      images: body.images,
      price: body.price,
      duration: body.duration,

      isApproved: false, // Default to false (admin approval required)
    });
    await service.save();

    return NextResponse.json({ message: 'Service added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}