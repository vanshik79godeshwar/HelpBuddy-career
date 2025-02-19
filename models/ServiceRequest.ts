// models/ServiceRequest.ts
import mongoose, { Schema, Document } from 'mongoose';
import User from './User'; // Ensure User model is imported

export interface IServiceRequest extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  dateTime: Date;
  duration: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  serviceProviderId?: mongoose.Types.ObjectId;
}

const serviceRequestSchema = new Schema<IServiceRequest>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  serviceProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
  },
}, { timestamps: true });

export default mongoose.models.ServiceRequest || mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);