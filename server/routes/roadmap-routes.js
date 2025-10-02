import Router from 'express';
import { 
  generateRoadmapController,
  
} from '../controllers/roadMap-generator-controller.js';

import  {getRoadmapById,
  getUserRoadmaps,
  searchRoadmaps,
  deleteRoadmap,} from "../controllers/roadMap-crud-controller.js"
const router = Router();

// Generate new roadmap
router.post("/roadmap/generation", generateRoadmapController);

// Get specific roadmap by ID
router.get("/roadmap/:id", getRoadmapById);

// Get all roadmaps for a specific user with pagination and filters
router.get("/:userId/roadmaps", getUserRoadmaps);

// Search roadmaps with filters (public roadmaps only)
router.get("/roadmaps/search", searchRoadmaps);


// Delete roadmap (user must own the roadmap)
router.delete("/roadmap/:id", deleteRoadmap);


export default router;
