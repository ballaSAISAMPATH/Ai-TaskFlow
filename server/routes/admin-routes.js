import express from 'express';
import {
  getDashboardStats,
  getAllFeedback,
  replyToFeedback,
  getUserStatistics,
  deleteUser
} from '../controllers/admin-controller.js';

const router = express.Router();

router.get('/dashboard/stats', getDashboardStats);

router.get('/feedback', getAllFeedback);
router.put('/feedback/:feedbackId/reply', replyToFeedback);

router.get('/users/statistics', getUserStatistics);
router.delete('/users/:userId', deleteUser);

export default router;