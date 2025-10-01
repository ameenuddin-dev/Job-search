import express from 'express';
import Job from '../models/Job';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// POST: Create Job (Employer Only)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'employer')
      return res.status(403).json({ error: 'Only employers can post jobs' });

    const { title, company, location, salary, status } = req.body;
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      status,
      postedBy: req.user.id,
    });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// GET: Recruiter's Jobs (with pagination)
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

// PUT: Update Job
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

// DELETE: Delete Job
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

// PUT: Toggle Job Status
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

// GET: Get Job Applicants
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

export default router;
