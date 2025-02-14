// models/Service.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  workerId: string; // Reference to the worker who created the service
  title: string; // Brief idea about the service (e.g., "AC Installation")
  category: string; // Category of the service (e.g., "AC Installation", "Cleaning", etc.)
  place: string; // Place where the service is applicable (e.g., "Home", "Office", etc.)
  description: string; // Detailed description of the service
  images: string[]; // Array of image URLs (uploaded to Cloudinary)
  price: number; // Price of the service
  duration: string; // Estimated time to complete the service (e.g., "2 hours")
  isApproved: boolean; // Admin approval status
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

const serviceSchema = new Schema<IService>(
  {
    workerId: { type: String, required: true }, // Worker ID from AuthContext or JWT
    title: { type: String, required: true },
    category: { type: String, required: true },
    place: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }], // Array of Cloudinary image URLs
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Default to false (admin approval required)
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
export default Service;