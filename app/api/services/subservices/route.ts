// app/api/services/subservices/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import subService from '@/models/subservices'; // Adjust the path as needed

export async function GET() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI!);

    // Fetch all subservices
    const subservices = await subService.find({}).lean();

    // Close the database connection
    await mongoose.connection.close();

    // Return the subservices as JSON
    return NextResponse.json(subservices);
  } catch (error: unknown) {
    console.error('Error fetching subservices:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}