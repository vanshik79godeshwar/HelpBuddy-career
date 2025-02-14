// models/Worker.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IWorker extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean; // otp one
  isApproved: boolean; // by admin
  image: string;
}

const workerSchema = new Schema<IWorker>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }, 
    isApproved: { type: Boolean, default: false }, // Default to false
    image: { type: String, default: '/images/default-avatar.png' }, 
  },
  { timestamps: true }
);

const Worker = mongoose.models.Worker || mongoose.model<IWorker>('Worker', workerSchema);
export default Worker;