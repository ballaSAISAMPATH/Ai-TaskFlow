import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/userDashboard-controller.js";

const router = Router();

// Analytics for graphs only (7-day data)
router.get('/dashboard/analytics/:userId', getDashboardAnalytics);

export default router;