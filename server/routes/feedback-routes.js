const express = require('express');
const router = express.Router();
const {createFeedback,getAllFeedback,getFeedbackByUser,deleteFeedback} = require('../controllers/feedback-controller')
router.post('/createFeedback', createFeedback);

router.get('/getAllFeedback', getAllFeedback);

router.get('/getFeedbackByUser/user/:userId', getFeedbackByUser);

router.delete('/deleteFeedback/:id', deleteFeedback);

module.exports = router;
