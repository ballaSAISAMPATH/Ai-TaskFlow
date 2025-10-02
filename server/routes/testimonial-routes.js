import { Router } from "express";
import { getAllTestimonials, getTestimonialsWithPagination, addFeedbackToTestimonials, deleteTestimonial } from "../controllers/testimonials-controller.js";

const router = Router();

router.get("/", getAllTestimonials);
router.get("/paginated", getTestimonialsWithPagination);

router.post("/add-feedback/:feedbackId", addFeedbackToTestimonials);
router.delete("/:id", deleteTestimonial);

export default router;