import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  status: string;
}

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  salary: number;
  postedBy: mongoose.Types.ObjectId;
  status: 'open' | 'closed';
  description?: string;
  applicants: IApplicant[];
  savedBy: mongoose.Types.ObjectId[];
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  description: { type: String },
  applicants: [
    {
      _id: { type: Schema.Types.ObjectId, ref: 'User' },
      name: String,
      email: String,
      status: { type: String, default: 'Applied' }, // ✅ added
    },
  ],
  savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // ✅ candidates who saved
});

export default mongoose.model<IJob>('Job', jobSchema);
