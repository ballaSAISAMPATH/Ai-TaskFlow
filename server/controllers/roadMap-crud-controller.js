import { configDotenv } from "dotenv";
import mongoose from 'mongoose';
import { Roadmap } from "../models/roadmap.js";

configDotenv();

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
    
    const roadmap = await Roadmap.findById(id);
    
    if (!roadmap) {
      return res.status(404).json({ 
        error: "Roadmap not found" 
      });
    }
    
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
    const { skill, approach, sortBy } = req.query;
    
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
    
    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'concepts':
        sortOptions = { totalConcepts: -1 };
        break;
      case 'alphabetical':
        sortOptions = { skill: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    
    // Fetch all roadmaps for user
    const roadmaps = await Roadmap.find(query)
      .sort(sortOptions)
      .select('skill totalConcepts approach createdAt isPublic');
    
    res.status(200).json({
      success: true,
      roadmaps
    });
    
  } catch (error) {
    console.error("Error fetching user roadmaps:", error);
    res.status(500).json({ 
      error: "Error fetching user roadmaps" 
    });
  }
};

// Get User Roadmap Stats Controller
export const getUserRoadmapStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        error: "Invalid user ID format" 
      });
    }
    
    // Get roadmap statistics
    const [totalRoadmaps, publicRoadmaps] = await Promise.all([
      Roadmap.countDocuments({ userId: userId }),
      Roadmap.countDocuments({ userId: userId, isPublic: true })
    ]);
    
    const stats = {
      totalRoadmaps,
      publicRoadmaps,
      privateRoadmaps: totalRoadmaps - publicRoadmaps
    };
    
    res.status(200).json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ 
      error: "Error fetching user roadmap statistics" 
    });
  }
};

// Search Public Roadmaps Controller
export const searchRoadmaps = async (req, res) => {
  try {
    const { skill, approach } = req.query;
    
    // Build search query - only public roadmaps
    let query = { isPublic: true };
    
    if (skill) {
      query.skill = { $regex: skill, $options: 'i' };
    }
    
    if (approach) {
      query['approach.name'] = approach;
    }
    
    // Fetch public roadmaps
    const roadmaps = await Roadmap.find(query)
      .sort({ createdAt: -1 })
      .select('skill totalConcepts approach createdAt userId')
      .populate('userId', 'name');
    
    res.status(200).json({
      success: true,
      roadmaps
    });
    
  } catch (error) {
    console.error("Error searching roadmaps:", error);
    res.status(500).json({ 
      error: "Error searching roadmaps" 
    });
  }
};

// Update Roadmap Visibility Controller
export const updateRoadmapVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic, userId } = req.body;
    
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
        error: "Not authorized to update this roadmap" 
      });
    }
    
    // Update visibility
    roadmap.isPublic = isPublic;
    await roadmap.save();
    
    res.status(200).json({
      success: true,
      message: `Roadmap made ${isPublic ? 'public' : 'private'} successfully`,
      roadmap
    });
    
  } catch (error) {
    console.error("Error updating roadmap visibility:", error);
    res.status(500).json({ 
      error: "Error updating roadmap visibility" 
    });
  }
};

// Delete Roadmap Controller
export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
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
