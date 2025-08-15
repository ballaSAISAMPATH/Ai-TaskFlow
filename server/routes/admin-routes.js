const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllFeedback,
  replyToFeedback,
  getUserStatistics,
  deleteUser
} = require('../controllers/admin-controller');



router.get('/dashboard/stats', getDashboardStats);

router.get('/feedback', getAllFeedback);
router.put('/feedback/:feedbackId/reply', replyToFeedback);

router.get('/users/statistics', getUserStatistics);
router.delete('/users/:userId', deleteUser);

module.exports = router;