// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  area: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  interestedCategory?: string[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  walletCoins: number; // Add this field
  referralCode?: string; // Add this field
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    area: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    interestedCategory: { type: [String], default: [] },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    walletCoins: { type: Number, default: 0 }, // Initialize with 0
    referralCode: { type: String }, // Optional field
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export type User = IUser;

export default User;