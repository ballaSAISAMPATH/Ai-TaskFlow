const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

testimonialSchema.index({ feedbackId: 1 }, { unique: true, sparse: true });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;