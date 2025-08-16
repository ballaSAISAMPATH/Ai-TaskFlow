const User = require('../models/User');
const Goal = require('../models/goal');
const Feedback = require('../models/feedback');
const mongoose = require('mongoose');

const getUserFilter = () => ({
  $or: [
    { role: 'user' },
    { role: { $exists: false } }  
  ]
});

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(getUserFilter());
    
    const totalGoals = await Goal.countDocuments();
    
    const totalFeedback = await Feedback.countDocuments();
    
    const completedGoals = await Goal.countDocuments({ isCompleted: true });
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ 
      $and: [
        getUserFilter(),
        { createdAt: { $gte: thirtyDaysAgo } }
      ]
    });
    
    const monthlyUserData = await User.aggregate([
      {
        $match: {
          $and: [
            getUserFilter(),
            {
              createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    const goalCompletionData = await Goal.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalGoals: { $sum: 1 },
          completedGoals: {
            $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    const ratingStats = await Feedback.aggregate([
      {
        $match: { rating: { $ne: null } }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalGoals,
        totalFeedback,
        completedGoals,
        newUsers,
        averageRating: ratingStats[0]?.averageRating || 0,
        totalRatings: ratingStats[0]?.totalRatings || 0,
        monthlyUserData,
        goalCompletionData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const feedback = await Feedback.find()
      .populate('userId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalFeedback = await Feedback.countDocuments();
    
    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFeedback / limit),
          totalFeedback,
          hasNextPage: page < Math.ceil(totalFeedback / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

const replyToFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { reply } = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { reply },
      { new: true }
    ).populate('userId', 'name email profilePicture');
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reply added successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error replying to feedback',
      error: error.message
    });
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find(getUserFilter())
      .select('name email profilePicture createdAt role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const userStats = await Promise.all(users.map(async (user) => {
      const totalGoals = await Goal.countDocuments({ userId: user._id });
      const completedGoals = await Goal.countDocuments({ 
        userId: user._id, 
        isCompleted: true 
      });
      const totalFeedback = await Feedback.countDocuments({ userId: user._id });
      
      const goals = await Goal.find({ userId: user._id });
      let totalTasks = 0;
      let completedTasks = 0;
      
      goals.forEach(goal => {
        goal.monthlyTasks.forEach(taskGroup => {
          totalTasks += taskGroup.tasks.length;
          if (taskGroup.status) completedTasks += taskGroup.tasks.length;
        });
        goal.weeklyTasks.forEach(taskGroup => {
          totalTasks += taskGroup.tasks.length;
          if (taskGroup.status) completedTasks += taskGroup.tasks.length;
        });
        goal.dailyTasks.forEach(taskGroup => {
          totalTasks += taskGroup.tasks.length;
          if (taskGroup.status) completedTasks += taskGroup.tasks.length;
        });
      });
      
      return {
        ...user.toObject(),
        role: user.role || 'user',
        statistics: {
          totalGoals,
          completedGoals,
          totalTasks,
          completedTasks,
          totalFeedback,
          completionRate: totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : 0,
          taskCompletionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
        }
      };
    }));
    
    const totalUsers = await User.countDocuments(getUserFilter());
    
    res.json({
      success: true,
      data: {
        users: userStats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNextPage: page < Math.ceil(totalUsers / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }
    
    await Goal.deleteMany({ userId });
    await Feedback.deleteMany({ userId });
    
    await User.findByIdAndDelete(userId);
    
    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllFeedback,
  replyToFeedback,
  getUserStatistics,
  deleteUser
};