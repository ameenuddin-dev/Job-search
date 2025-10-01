import { Request, Response } from "express";
import Job from "../models/Job";

export const postJob = async (req: Request, res: Response) => {
  try {
    const { title, company, location, salary, description } = req.body;
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      postedBy: (req as any).user.id,
    });
    res.json({ message: "Job posted", job });
  } catch (error) {
    res.status(500).json({ error: "Failed to post job" });
  }
};

export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
