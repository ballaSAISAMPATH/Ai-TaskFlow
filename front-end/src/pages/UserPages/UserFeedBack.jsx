import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Trash2, 
  Star, 
  MessageCircle, 
  Send, 
  Plus,
  Calendar,
  Heart,
  Sparkles,
  Gift,
  ThumbsUp,
  Edit3,
  Clock,
  User,
  CheckCircle
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
  const [hoveredRating, setHoveredRating] = useState(0);

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

  const renderStars = (rating, interactive = false, size = 'w-6 h-6') => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = interactive 
        ? starValue <= (hoveredRating || feedbackData.rating)
        : starValue <= rating;
      
      return (
        <Star
          key={index}
          className={`${size} cursor-pointer transition-all duration-200 ${
            isFilled 
              ? 'fill-green-500 text-green-500 scale-110' 
              : 'text-gray-300 hover:text-green-400 hover:scale-105'
          }`}
          onClick={() => interactive && handleRatingClick(starValue)}
          onMouseEnter={() => interactive && setHoveredRating(starValue)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        />
      );
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      1: { text: "Poor", icon: "😞", color: "text-red-500" },
      2: { text: "Fair", icon: "😐", color: "text-orange-500" },
      3: { text: "Good", icon: "😊", color: "text-yellow-500" },
      4: { text: "Very Good", icon: "😄", color: "text-green-400" },
      5: { text: "Excellent", icon: "🤩", color: "text-green-500" }
    };
    return texts[rating] || { text: "", icon: "", color: "" };
  };

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
            <MessageCircle className="w-6 h-6 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-green-600 font-medium text-lg">Loading your feedback...</p>
          <p className="text-gray-500 text-sm mt-2">This won't take long</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
                <span>Your Feedback</span>
              </h1>
              <p className="text-gray-600 flex items-center space-x-2 mt-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Help us improve with your valuable insights</span>
              </p>
            </div>
          </div>
          
          {userFeedbacks.length > 0 && (
            <button
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span>New Feedback</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={clearErrorHandler}
              className="text-red-500 hover:text-red-700 hover:bg-red-200 rounded-full p-1 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>
      )}

      {(showFeedbackForm || userFeedbacks.length === 0) && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-3xl blur-xl transform scale-105"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Gift className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600">Your feedback helps us create better experiences for everyone</p>
            </div>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <ThumbsUp className="w-6 h-6 text-green-500" />
                  <label className="text-xl font-semibold text-gray-800">
                    Rate Your Experience
                  </label>
                </div>
                
                <div className="flex justify-center space-x-2 mb-4">
                  {renderStars(feedbackData.rating, true, 'w-8 h-8')}
                </div>
                
                {(hoveredRating || feedbackData.rating) > 0 && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">{getRatingText(hoveredRating || feedbackData.rating).icon}</span>
                    <span className={`font-semibold text-lg ${getRatingText(hoveredRating || feedbackData.rating).color}`}>
                      {getRatingText(hoveredRating || feedbackData.rating).text}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Edit3 className="w-5 h-5 text-green-500" />
                  <label className="text-xl font-semibold text-gray-800">
                    Tell Us More
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    value={feedbackData.message}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="We'd love to hear about your experience... What did you like? What could we improve?"
                    rows={5}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none resize-none text-gray-700 placeholder-gray-400 transition-all duration-300"
                    required
                  />
                  <MessageCircle className="absolute top-4 right-4 w-5 h-5 text-gray-300" />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={createLoading || !feedbackData.message.trim() || feedbackData.rating === 0}
                  className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto space-x-3 transform hover:-translate-y-1 disabled:transform-none"
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting Your Feedback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Feedback</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userFeedbacks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Feedback History</h2>
              <p className="text-gray-600">Thanks for helping us improve! 🙏</p>
            </div>
          </div>

          <div className="grid gap-6">
            {userFeedbacks.map((feedback, index) => (
              <div
                key={feedback._id}
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(feedback.rating, false, 'w-5 h-5')}
                        <span className={`font-bold text-lg ${getRatingText(feedback.rating).color}`}>
                          {getRatingText(feedback.rating).text}
                        </span>
                        <span className="text-xl">{getRatingText(feedback.rating).icon}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <Clock className="w-4 h-4 ml-2" />
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
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative">
                  <div className="bg-gray-50 rounded-2xl p-4 border-l-4 border-green-500">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userFeedbacks.length === 0 && !showFeedbackForm && !loading && (
        <div className="text-center py-20">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-full mx-auto flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Share Your Thoughts?</h2>
          <p className="text-gray-600 mb-8 text-lg">Your feedback is valuable to us - let's hear what you think!</p>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto space-x-3 transform hover:-translate-y-1"
          >
            <Gift className="w-6 h-6" />
            <span>Give Feedback</span>
            <Heart className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFeedBack;