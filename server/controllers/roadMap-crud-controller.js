import { configDotenv } from "dotenv";
import mongoose from 'mongoose';
import { Roadmap } from "../models/roadmap.js";

configDotenv()
// Fetch Roadmap by ID Controller
export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate roadmap ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        error: "Invalid roadmap ID format" 
      });
    }
    
    const roadmap = await Roadmap.findById(id).populate('userId', 'name email');
    
    if (!roadmap) {
      return res.status(404).json({ 
        error: "Roadmap not found" 
      });
    }
    
    // Increment views
    await roadmap.incrementViews();
    
    res.status(200).json({
      success: true,
      roadmap
    });
    
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({ 
      error: "Error fetching roadmap" 
    });
  }
};

// Fetch User's Roadmaps Controller
export const getUserRoadmaps = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1, skill, approach } = req.query;
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        error: "Invalid user ID format" 
      });
    }
    
    // Build query
    let query = { userId: userId };
    
    if (skill) {
      query.skill = { $regex: skill, $options: 'i' };
    }
    
    if (approach) {
      query['approach.name'] = approach;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch roadmaps with pagination
    const [roadmaps, totalCount] = await Promise.all([
      Roadmap.find(query)
        .sort({ generatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('skill totalConcepts approach generatedAt views likes isPublic'),
      Roadmap.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      roadmaps,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRoadmaps: totalCount,
        hasNextPage: skip + roadmaps.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error("Error fetching user roadmaps:", error);
    res.status(500).json({ 
      error: "Error fetching user roadmaps" 
    });
  }
};

// Search Roadmaps Controller
export const searchRoadmaps = async (req, res) => {
  try {
    const { skill, approach, limit = 20, page = 1 } = req.query;
    
    // Build search query
    let query = { isPublic: true };
    
    if (skill) {
      query.skill = { $regex: skill, $options: 'i' };
    }
    
    if (approach) {
      query['approach.name'] = approach;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch roadmaps with pagination
    const [roadmaps, totalCount] = await Promise.all([
      Roadmap.find(query)
        .sort({ views: -1, generatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('skill totalConcepts approach generatedAt views likes userId')
        .populate('userId', 'name'),
      Roadmap.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      roadmaps,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRoadmaps: totalCount
      }
    });
    
  } catch (error) {
    console.error("Error searching roadmaps:", error);
    res.status(500).json({ 
      error: "Error searching roadmaps" 
    });
  }
};


// Delete Roadmap Controller
export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Get userId from request body or token
    
    // Validate roadmap ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        error: "Invalid roadmap ID format" 
      });
    }
    
    const roadmap = await Roadmap.findById(id);
    
    if (!roadmap) {
      return res.status(404).json({ 
        error: "Roadmap not found" 
      });
    }
    
    // Check if user owns this roadmap
    if (roadmap.userId.toString() !== userId) {
      return res.status(403).json({ 
        error: "Not authorized to delete this roadmap" 
      });
    }
    
    await Roadmap.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    res.status(500).json({ 
      error: "Error deleting roadmap" 
    });
  }
};