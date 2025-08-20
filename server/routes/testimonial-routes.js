const express = require("express");
const {
  getAllTestimonials,
  getTestimonialsWithPagination,
  addFeedbackToTestimonials,
  deleteTestimonial
} = require("../controllers/testimonials-controller.js");

const router = express.Router();

router.get("/", getAllTestimonials);
router.get("/paginated", getTestimonialsWithPagination);

router.post("/add-feedback/:feedbackId", addFeedbackToTestimonials);
router.delete("/:id", deleteTestimonial);

module.exports = router;