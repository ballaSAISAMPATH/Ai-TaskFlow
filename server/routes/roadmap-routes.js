import Router from 'express';
import { generateRoadmapController } from '../controllers/roadMap-controller.js';
const router = Router();

router.post("/roadmap/generation",generateRoadmapController);

export default router;