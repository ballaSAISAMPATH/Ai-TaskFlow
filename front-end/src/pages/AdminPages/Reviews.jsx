import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Star, Send, User, Calendar, Trash2 } from 'lucide-react';
import { fetchAllFeedback, replyToFeedback, setActiveReplyId, deleteFeedback } from '@/store/admin';
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
} from '@/components/ui/alert-dialog';
import ScrollToTop from '@/utilities/ScrollToTop';
import { toast } from 'sonner';

const ReviewSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 sm:h-7 bg-gray-200 rounded w-12"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const Reviews = () => {
  const dispatch = useDispatch();
  const { feedback, feedbackPagination, feedbackLoading, feedbackError, activeReplyId } = useSelector(state => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyText, setReplyText] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [isPageChanging, setIsPageChanging] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsPageChanging(true);
      try {
        await dispatch(fetchAllFeedback({ page: currentPage, limit: 10 }));
      } finally {
        setIsPageChanging(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchFeedback();
  }, [dispatch, currentPage]);

  const handleReply = async (feedbackId) => {
    if (!replyText.trim()) return;
    
    try {
      await dispatch(replyToFeedback({ feedbackId, reply: replyText })).unwrap();
      toast.success('replied  sucessfully')

      setReplyText('');
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Error replying to feedback:', error);
      toast.error('error occured')
    }
  };

  const handleDeleteConfirm = async () => {
    if (!feedbackToDelete) return;
    
    try {
      await dispatch(deleteFeedback(feedbackToDelete._id)).unwrap();
      toast.success('review deleted sucessfully')
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('error occured')
    }
  };

  const openDeleteDialog = (feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFeedbackToDelete(null);
  };

  const startReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.reply || '');
    dispatch(setActiveReplyId(feedback._id));
  };

  const cancelReply = () => {
    setSelectedFeedback(null);
    setReplyText('');
    dispatch(setActiveReplyId(null));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const words = name.split(' ');
    return words.length > 1 
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name[0].toUpperCase();
  };

  const getAvatarColor = (name) => {
    return 'bg-green-500';
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-green-500 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Show skeleton loading for initial load or page changes
  if (feedbackLoading && currentPage === 1 || isPageChanging) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              User Reviews & Feedback
            </h1>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <ReviewSkeleton key={index} />
          ))}
        </div>

        {/* Skeleton pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="w-full sm:w-auto h-10 bg-gray-200 rounded-md animate-pulse" style={{ width: '80px' }}></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
          <div className="w-full sm:w-auto h-10 bg-gray-200 rounded-md animate-pulse" style={{ width: '60px' }}></div>
        </div>
      </div>
    );
  }

  if (feedbackError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {feedbackError}</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            User Reviews & Feedback
          </h1>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Reviews: {feedbackPagination?.totalFeedback || 0}
        </div>
      </div>

      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-200">
            <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500">No user feedback has been submitted yet.</p>
          </div>
        ) : (
          feedback.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 ${getAvatarColor(review.userId?.name)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {getInitials(review.userId?.name)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {review.userId?.name || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{review.userId?.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
                    {review.rating && (
                      <div className="flex-shrink-0">
                        {renderStars(review.rating)}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {!review.reply && (
                        <button
                          onClick={() => startReply(review)}
                          className="px-3 py-1.5 text-xs sm:text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex-shrink-0"
                        >
                          Reply
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteDialog(review)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                        title="Delete feedback"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                  {review.message}
                </p>
              </div>

              {review.reply && (
                <div className="p-4 sm:p-6 bg-green-50 border-t border-green-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-green-700">Admin Reply</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base break-words">{review.reply}</p>
                      <button
                        onClick={() => startReply(review)}
                        className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
                      >
                        Edit Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedFeedback?._id === review._id && (
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {review.reply ? 'Edit Reply' : 'Write a Reply'}
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
                      rows={4}
                    />
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => handleReply(review._id)}
                        disabled={!replyText.trim()}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                      >
                        <Send className="h-4 w-4" />
                        <span>{review.reply ? 'Update Reply' : 'Send Reply'}</span>
                      </button>
                      <button
                        onClick={cancelReply}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {feedbackPagination && feedbackPagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isPageChanging}
            className="w-full cursor-pointer sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: Math.min(feedbackPagination.totalPages, 5) }, (_, i) => {
              let page;
              if (feedbackPagination.totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= feedbackPagination.totalPages - 2) {
                page = feedbackPagination.totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isPageChanging}
                  className={`px-3 py-2 rounded-md text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${
                    currentPage === page
                      ? 'bg-green-500 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, feedbackPagination.totalPages))}
            disabled={currentPage === feedbackPagination.totalPages || isPageChanging}
            className="w-full sm:w-auto cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-2">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback from{' '}
              <span className="font-semibold">
                {feedbackToDelete?.userId?.name || 'Anonymous User'}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reviews;