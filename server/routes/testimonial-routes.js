import express from "express";
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  bulkCreateTestimonials,
  getTestimonialsWithPagination
} from "../controllers/feedback-controller";


const router = express.Router();

router.get("/", getAllTestimonials);
router.get("/paginated", getTestimonialsWithPagination);
router.get("/:id", getTestimonialById);

router.post("/",  createTestimonial);
router.put("/:id",  updateTestimonial);
router.delete("/:id",  deleteTestimonial);
router.post("/bulk",  bulkCreateTestimonials);

export default router;