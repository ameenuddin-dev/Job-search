import { Request, Response } from 'express';
import Job from '../models/Job';

// Create job
export const postJob = async (req: Request, res: Response) => {
  try {
    const { title, company, location, salary, description } = req.body; // ✅ include description
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description, // ✅ save description
      postedBy: (req as any).user.id,
    });
    res.json({ message: 'Job posted', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post job' });
  }
};

// Get all jobs
export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Update job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const { title, company, location, salary, status, description } = req.body; // ✅ include description
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, company, location, salary, status, description }, // ✅ update description
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

// Delete job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

// Toggle job status
export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    job.status = job.status === 'open' ? 'closed' : 'open';
    await job.save();
    res.json({ message: 'Status updated', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle status' });
  }
};

// Get applicants
export const getApplicants = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'applicants',
      'name email'
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};
