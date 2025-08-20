const Testimonial = require("../models/tetstimonials");
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

// Get single testimonial by ID
 const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching testimonial",
      error: error.message
    });
  }
};

// Create new testimonial (admin only)
 const createTestimonial = async (req, res) => {
  try {
    const { name, content, rating } = req.body;
    
    // Validation
    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Name and content are required"
      });
    }
    
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }
    
    const testimonial = await Testimonial.create({
      name: name.trim(),
      content: content.trim(),
      rating: rating || 5
    });
    
    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating testimonial",
      error: error.message
    });
  }
};

// Update testimonial (admin only)
 const updateTestimonial = async (req, res) => {
  try {
    const { name, content, rating } = req.body;
    const testimonialId = req.params.id;
    
    // Check if testimonial exists
    const existingTestimonial = await Testimonial.findById(testimonialId);
    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }
    
    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }
    
    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (content) updateData.content = content.trim();
    if (rating) updateData.rating = rating;
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      testimonialId,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error updating testimonial",
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
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting testimonial",
      error: error.message
    });
  }
};

// Bulk create testimonials (admin only)
 const bulkCreateTestimonials = async (req, res) => {
  try {
    const { testimonials } = req.body;
    
    if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Testimonials array is required"
      });
    }
    
    // Validate each testimonial
    const validatedTestimonials = testimonials.map((testimonial, index) => {
      if (!testimonial.name || !testimonial.content) {
        throw new Error(`Testimonial at index ${index}: name and content are required`);
      }
      
      if (testimonial.rating && (testimonial.rating < 1 || testimonial.rating > 5)) {
        throw new Error(`Testimonial at index ${index}: rating must be between 1 and 5`);
      }
      
      return {
        name: testimonial.name.trim(),
        content: testimonial.content.trim(),
        rating: testimonial.rating || 5
      };
    });
    
    const createdTestimonials = await Testimonial.insertMany(validatedTestimonials);
    
    res.status(201).json({
      success: true,
      message: `${createdTestimonials.length} testimonials created successfully`,
      data: createdTestimonials
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get testimonials with pagination (public route)
 const getTestimonialsWithPagination = async (req, res) => {
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

module.exports = {getAllTestimonials,createTestimonial, getTestimonialById, updateTestimonial,deleteTestimonial,bulkCreateTestimonials,getTestimonialsWithPagination }