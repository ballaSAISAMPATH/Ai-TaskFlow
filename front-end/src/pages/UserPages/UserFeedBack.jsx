import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Trash2, 
  Star, 
  MessageCircle, 
  Send, 
  Plus,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  createFeedback,
  getFeedbackByUser,
  deleteFeedback,
  selectUserFeedbacks,
  selectFeedbackLoading,
  selectFeedbackError,
  selectCreateLoading,
  selectDeleteLoading,
  clearError  } from '@/store/feedback';

const UserFeedBack = () => {
  const dispatch = useDispatch();
  const userFeedbacks = useSelector(selectUserFeedbacks);
  const loading = useSelector(selectFeedbackLoading);
  const error = useSelector(selectFeedbackError);
  const createLoading = useSelector(selectCreateLoading);
  const deleteLoading = useSelector(selectDeleteLoading);
  const { user } = useSelector((state) => state.auth)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);  
  const [feedbackData, setFeedbackData] = useState({
    message: '',
    rating: 0
  });

  const userId = user.id; 

  useEffect(() => {
    if (userId) {
      dispatch(getFeedbackByUser(userId));
    }
  }, [dispatch, userId]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackData.message.trim() || feedbackData.rating === 0) {
      return;
    }

    try {
      await dispatch(createFeedback({
        userId,
        message: feedbackData.message.trim(),
        rating: feedbackData.rating
      })).unwrap();

      setFeedbackData({ message: '', rating: 0 });
      setShowFeedbackForm(false);
      
      dispatch(getFeedbackByUser(userId));
    } catch (error) {
      console.error('Failed to create feedback:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await dispatch(deleteFeedback(feedbackId)).unwrap();
      } catch (error) {
        console.error('Failed to delete feedback:', error);
      }
    }
  };

  const handleRatingClick = (rating) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = interactive 
        ? starValue <= feedbackData.rating
        : starValue <= rating;
      
      return (
        <Star
          key={index}
          className={`w-5 h-5 cursor-pointer ${
            isFilled 
              ? 'fill-green-500 text-green-500' 
              : 'text-gray-300 hover:text-green-500'
          }`}
          onClick={() => interactive && handleRatingClick(starValue)}
        />
      );
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair", 
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return texts[rating] || "";
  };

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-500 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading your feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Feedback</h1>
          <p className="text-gray-600">Help us improve with your valuable insights</p>
        </div>
        
        {userFeedbacks.length > 0 && (
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Feedback</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearErrorHandler}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {(showFeedbackForm || userFeedbacks.length === 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Share Your Experience</h2>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Your Experience
              </label>
              <div className="flex items-center space-x-1 mb-2">
                {renderStars(feedbackData.rating, true)}
              </div>
              {feedbackData.rating > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  {getRatingText(feedbackData.rating)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tell Us More
              </label>
              <textarea
                value={feedbackData.message}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="What did you like? What could we improve?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createLoading || !feedbackData.message.trim() || feedbackData.rating === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2"
            >
              {createLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {userFeedbacks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Feedback History</h2>
          <div className="space-y-4">
            {userFeedbacks.map((feedback, index) => (
              <div
                key={feedback._id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(feedback.rating, false)}
                      <span className="font-medium text-green-600">
                        {getRatingText(feedback.rating)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(feedback.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    disabled={deleteLoading}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded disabled:opacity-50"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded p-4 border-l-4 border-green-500">
                  <p className="text-gray-700">{feedback.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userFeedbacks.length === 0 && !showFeedbackForm && !loading && (
        <div className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ready to Share Your Thoughts?</h2>
          <p className="text-gray-600 mb-6">Your feedback is valuable to us</p>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg flex items-center mx-auto space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Give Feedback</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFeedBack;