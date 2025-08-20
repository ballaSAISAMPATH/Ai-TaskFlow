const express = require("express");
const {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  bulkCreateTestimonials,
  getTestimonialsWithPagination
} = require("../controllers/testimonials-controller.js");

const router = express.Router();

router.get("/", getAllTestimonials);
router.get("/paginated", getTestimonialsWithPagination);
router.get("/:id", getTestimonialById);

router.post("/",  createTestimonial);
router.put("/:id",  updateTestimonial);
router.delete("/:id",  deleteTestimonial);
router.post("/bulk",  bulkCreateTestimonials);

module.exports = router