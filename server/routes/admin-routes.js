const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllFeedback,
  replyToFeedback,
  getUserStatistics,
  deleteUser
} = require('../controllers/adminController');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    // Assuming you have authentication middleware that sets req.user
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

// Apply admin auth middleware to all routes
router.use(adminAuth);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// Feedback routes
router.get('/feedback', getAllFeedback);
router.put('/feedback/:feedbackId/reply', replyToFeedback);

// User routes
router.get('/users/statistics', getUserStatistics);
router.delete('/users/:userId', deleteUser);

module.exports = router;