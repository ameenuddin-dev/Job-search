import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  salary: number;
  postedBy: mongoose.Types.ObjectId;
  status: 'open' | 'closed';
  applicants: { name: string; email: string }[];
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  applicants: [
    {
      name: String,
      email: String,
    },
  ],
});

export default mongoose.model<IJob>('Job', jobSchema);
