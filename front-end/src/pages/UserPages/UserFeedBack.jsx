import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Trash2, 
  Star, 
  MessageCircle, 
  Send, 
  Plus,
  Calendar,
  Clock,
  Reply
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  createFeedback,
  getFeedbackByUser,
  selectUserFeedbacks,
  selectFeedbackLoading,
  selectFeedbackError,
  selectCreateLoading,
  selectDeleteLoading,
  clearError  } from '@/store/feedback';

const SkeletonLoader = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-0 space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>

      {/* Feedback Cards Skeleton */}
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {/* Stars skeleton */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded"></div>
                ))}
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded p-3 sm:p-4 border-l-4 border-gray-300">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>

            {item === 1 && (
              <div className="bg-blue-50 rounded p-3 sm:p-4 border-l-4 border-gray-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

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
  
  const userId = user?user.id:null; 

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
          className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${
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
    return <SkeletonLoader />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-0 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Your Feedback</h1>
          <p className="text-gray-600 text-sm sm:text-base">Help us improve with your valuable insights</p>
        </div>
        
        {userFeedbacks.length > 0 && (
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Feedback</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-sm sm:text-base">{error}</p>
            <button
              onClick={clearErrorHandler}
              className="text-red-500 hover:text-red-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {(showFeedbackForm || userFeedbacks.length === 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Share Your Experience</h2>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
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
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Tell Us More
              </label>
              <textarea
                value={feedbackData.message}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="What did you like? What could we improve?"
                rows={3}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
              <button
                type="submit"
                disabled={createLoading || !feedbackData.message.trim() || feedbackData.rating === 0}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
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
              
              {showFeedbackForm && userFeedbacks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="w-full sm:w-auto sm:ml-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {userFeedbacks.map((feedback, index) => (
  <div
    key={feedback._id}
    className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 relative"
  >
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          {renderStars(feedback.rating, false)}
          <span className="font-medium text-green-600 text-sm sm:text-base">
            {getRatingText(feedback.rating)}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>
              {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>
              {new Date(feedback.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>


    </div>

    <div className="space-y-4">
      <div className="bg-gray-50 rounded p-3 sm:p-4 border-l-4 border-green-500">
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{feedback.message}</p>
      </div>

      {feedback.reply && (
        <div className="bg-blue-50 rounded p-3 sm:p-4 border-l-4 border-blue-500">
          <div className="flex items-center space-x-2 mb-2">
            <Reply className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Admin Reply</span>
          </div>
          <p className="text-blue-800 text-sm sm:text-base leading-relaxed">{feedback.reply}</p>
        </div>
      )}
    </div>
  </div>
))}

      {userFeedbacks.length === 0 && !showFeedbackForm && !loading && (
        <div className="text-center py-12 sm:py-16">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Ready to Share Your Thoughts?</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Your feedback is valuable to us</p>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 sm:px-6 rounded-lg flex items-center mx-auto space-x-2 text-sm sm:text-base"
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