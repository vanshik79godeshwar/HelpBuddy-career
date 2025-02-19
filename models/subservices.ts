import mongoose, { Schema, Document } from 'mongoose';

export interface IsubService extends Document {
    name: string;
    category: string;
    price: number;
}

const subServiceSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a title for this service'],
        maxlength: [60, 'Title cannot be more than 60 characters']
    },
    category: {
        type: String,
        required: [true, 'Please specify the service category'],
        maxlength: [40, 'Category cannot be more than 40 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please specify the price'],
        min: [0, 'Price cannot be negative']
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            ret._id = ret._id.toString();
            return ret;
        }
    }
});

export default mongoose.models.subService || mongoose.model<IsubService>('subService', subServiceSchema);

