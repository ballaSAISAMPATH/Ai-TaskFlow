const Testimonial = require("../models/tetstimonials");
const Feedback = require("../models/feedback"); // Add this import

// Get all testimonials (public route)
const getAllTestimonials = async (req, res) => {
  
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .select('name content rating createdAt');
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching testimonials",
      error: error.message
    });
  }
};

// Get testimonials with pagination (public route)
const getTestimonialsWithPagination = async (req, res) => {
    console.log(req.body);

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name content rating createdAt');
    
    const total = await Testimonial.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        currentPage: page,
        totalPages,
        totalTestimonials: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching testimonials",
      error: error.message
    });
  }
};

// Add feedback to testimonials (admin only)
const addFeedbackToTestimonials = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    
    // Check if feedback exists
    const feedback = await Feedback.findById(feedbackId)
      .populate('userId', 'userName email name');
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    // Check if this feedback is already added as testimonial
    const existingTestimonial = await Testimonial.findOne({ feedbackId: feedbackId });
    if (existingTestimonial) {
      return res.status(400).json({
        success: false,
        message: "This feedback is already added as testimonial"
      });
    }

    // Create testimonial from feedback
    const testimonial = await Testimonial.create({
      name: feedback.userId?.userName || feedback.userId?.name || 'Anonymous',
      content: feedback.message,
      rating: feedback.rating || 5,
      feedbackId: feedback._id // Store reference to original feedback
    });
    
    res.status(201).json({
      success: true,
      message: "Feedback added to testimonials successfully",
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding feedback to testimonials",
      error: error.message
    });
  }
};

// Delete testimonial (admin only)
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }
    
    await Testimonial.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Testimonial removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing testimonial",
      error: error.message
    });
  }
};

module.exports = {
  getAllTestimonials,
  getTestimonialsWithPagination,
  addFeedbackToTestimonials,
  deleteTestimonial
};