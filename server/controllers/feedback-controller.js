import Feedback from '../models/feedback.js';

const createFeedback = async (req, res) => {
  try {
    const { userId, message, rating } = req.body;

    const feedback = new Feedback({
      userId,
      message,
      rating
    });

    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'userName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeedbackByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ userId })
      .populate('userId', 'userName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createFeedback,
  getAllFeedback,
  getFeedbackByUser,
  deleteFeedback
};