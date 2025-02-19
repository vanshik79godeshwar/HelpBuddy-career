// models/ServiceCompletion.ts
import mongoose, { Schema, Document } from 'mongoose';
import ServiceRequest from './ServiceRequest';

export interface IServiceCompletion extends Document {
  serviceRequestId: mongoose.Types.ObjectId;
  completionStatus: 'completed' | 'pending';
  completionPhoto: string; // URL of the completion photo
}

const serviceCompletionSchema = new Schema<IServiceCompletion>({
  serviceRequestId: {
    type: Schema.Types.ObjectId,
    ref: ServiceRequest,
    required: true,
  },
  completionStatus: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'pending',
  },
  completionPhoto: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const ServiceCompletion = mongoose.models.ServiceCompletion || mongoose.model<IServiceCompletion>('ServiceCompletion', serviceCompletionSchema);
export default ServiceCompletion;