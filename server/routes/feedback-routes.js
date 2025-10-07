import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getFeedbackByUser,
  deleteFeedback
} from '../controllers/feedback-controller.js';

const router = express.Router();

router.post('/createFeedback', createFeedback);
router.get('/getAllFeedback', getAllFeedback);
router.get('/getFeedbackByUser/user/:userId', getFeedbackByUser);
router.delete('/deleteFeedback/:id', deleteFeedback);

export default router;