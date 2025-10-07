import express from 'express';
import Job from '../models/Job';
import {
  postJob,
  getJobs,
  updateJob,
  deleteJob,
  toggleStatus,
  getApplicants,
  generateJobDescription,
} from '../controllers/jobController';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getJobs);
router.post('/', authMiddleware, postJob);
router.put('/:id', authMiddleware, updateJob); // Edit job
router.delete('/:id', authMiddleware, deleteJob); // Delete job
router.put('/:id/status', authMiddleware, toggleStatus); // Open/Close
router.get('/:id/applicants', authMiddleware, getApplicants); //

// New route: Generate AI Job Description
router.post('/generate-description', authMiddleware, generateJobDescription);
// POST: Create Job (Employer Only)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can post jobs' });
    }

    const { title, company, location, salary, status } = req.body;

    // Create job
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      status: status || 'open', // default to open
      postedBy: req.user.id,
    });

    res.json({ message: 'Job created successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.get('/my', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'employer')
      return res.status(403).json({ error: 'Only employers can access this' });

    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const jobs = await Job.find({ postedBy: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

router.put('/:id/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    job.status = status;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.get('/:id/applicants', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    res.json(job.applicants || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// Candidate applied jobs
router.get('/applied', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'candidate')
      return res.status(403).json({ error: 'Only candidates can access this' });

    const jobs = await Job.find({ 'applicants._id': req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applied jobs' });
  }
});

// Save / Unsave a job
router.put('/:id/save', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'candidate')
      return res.status(403).json({ error: 'Only candidates can save jobs' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const index = job.savedBy.findIndex((id) => id.toString() === req.user.id);

    if (index === -1) {
      job.savedBy.push(req.user.id); // Save
    } else {
      job.savedBy.splice(index, 1); // Unsave
    }

    await job.save();
    res.json({ message: 'Saved jobs updated', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update saved jobs' });
  }
});

// Get all saved jobs of candidate
router.get('/saved', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'candidate')
      return res
        .status(403)
        .json({ error: 'Only candidates can access saved jobs' });

    const jobs = await Job.find({ savedBy: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
});

// Candidate apply job
router.put('/:id/apply', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'candidate')
      return res
        .status(403)
        .json({ error: 'Only candidates can apply for jobs' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if already applied
    const alreadyApplied = job.applicants.find(
      (applicant) => applicant._id.toString() === req.user.id
    );
    if (alreadyApplied)
      return res.status(400).json({ error: 'Already applied' });

    job.applicants.push({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      status: 'Applied', // ✅ works now
    });

    await job.save();

    res.json({ message: 'Applied successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});

export default router;
