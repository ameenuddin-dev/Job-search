import { Router } from "express";
import { postJob, getJobs } from "../controllers/jobController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, postJob);
router.get("/", getJobs);

export default router;
