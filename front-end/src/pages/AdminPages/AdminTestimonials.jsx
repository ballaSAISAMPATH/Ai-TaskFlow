import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Star, X, AlertTriangle } from 'lucide-react';
import { fetchAllFeedback } from '@/store/admin';
import { 
  fetchAllTestimonials,
  addFeedbackToTestimonials,
  deleteTestimonial,
  clearError,
  clearSuccessMessage,
  setCurrentPage 
} from '@/store/testimonials.js';

// Skeleton Loading Components
const TestimonialSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1 min-w-0">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mb-2"></div>
        <div className="flex space-x-1">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg ml-2"></div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
    
    <div className="border-t border-gray-100 pt-3">
      <div className="h-3 bg-gray-200 rounded w-16 sm:w-24"></div>
    </div>
  </div>
);

const FeedbackSkeleton = () => (
  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 animate-pulse">
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-24 sm:w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-32 sm:w-40"></div>
        </div>
        <div className="hidden sm:flex space-x-1">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-3 sm:p-4 rounded-lg border-l-4 border-gray-200">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          <div className="h-3 bg-gray-200 rounded w-3/5"></div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div className="h-3 bg-gray-200 rounded w-20 sm:w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-full sm:w-32"></div>
      </div>
    </div>
  </div>
);

const AdminTestimonials = () => {
  const dispatch = useDispatch();
  const { 
    testimonials, 
    pagination, 
    loading, 
    error, 
    successMessage 
  } = useSelector(state => state.testimonials);
  
  const { feedback, loading: feedbackLoading } = useSelector(state => state.admin);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTestimonials({ page: 1, limit: 10 }));
    dispatch(fetchAllFeedback({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  const handleAddFeedbackToTestimonials = (feedbackId) => {
    dispatch(addFeedbackToTestimonials(feedbackId));
    setShowFeedbackModal(false);
  };

  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (testimonialToDelete) {
      dispatch(deleteTestimonial(testimonialToDelete._id));
    }
    setShowDeleteDialog(false);
    setTestimonialToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setTestimonialToDelete(null);
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchAllTestimonials({ page, limit: 10 }));
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={`sm:w-4 sm:h-4 ${i < rating ? 'text-green-600 fill-green-600' : 'text-gray-300'}`}
      />
    ));
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
        <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-4xl sm:m-4 max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col border border-gray-100">
          {/* Mobile header - no close button */}
          <div className="sm:hidden p-4 border-b border-gray-100 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
          </div>
          
          {/* Desktop header with close button */}
          <div className="hidden sm:flex justify-between items-center p-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 pr-4">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </div>
          
          {/* Mobile close button at bottom */}
          <div className="sm:hidden p-4 border-t border-gray-100 bg-white">
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <X size={20} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AlertDialog = ({ show, onConfirm, onCancel, title, message }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="p-4 sm:p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">{message}</p>
                <div className="flex flex-col-reverse sm:flex-row space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={onCancel}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Testimonials</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Select feedbacks to display as testimonials on your landing page
                </p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-lg transition-colors shadow-lg w-full sm:w-auto"
              >
                <Plus size={18} sm:size={20} />
                <span className="text-sm sm:text-base">Select from Feedbacks</span>
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm sm:text-base">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 flex items-center space-x-2">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}

          {/* Testimonials Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Current Testimonials
              </h2>
              {!loading && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                  {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {Array(6).fill(0).map((_, index) => (
                  <TestimonialSkeleton key={index} />
                ))}
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="text-gray-400" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">
                  Start by selecting some feedbacks to display as testimonials
                </p>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Select Feedbacks
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                          {testimonial.name}
                        </h3>
                        <div className="flex mt-2">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(testimonial)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group ml-2 flex-shrink-0"
                        title="Remove testimonial"
                      >
                        <Trash2 size={16} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                    
                    <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                      Added on {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1 overflow-x-auto pb-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let page;
                    if (pagination.totalPages <= 5) {
                      page = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      page = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      page = pagination.totalPages - 4 + i;
                    } else {
                      page = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors flex-shrink-0 ${
                          page === pagination.currentPage
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Feedback Modal */}
          <Modal 
            show={showFeedbackModal} 
            onClose={() => setShowFeedbackModal(false)}
            title="Select Feedbacks to Display as Testimonials"
          >
            {feedbackLoading ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 animate-pulse">
                  <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                </div>
                {Array(3).fill(0).map((_, index) => (
                  <FeedbackSkeleton key={index} />
                ))}
              </div>
            ) : feedback && feedback.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-xs sm:text-sm text-gray-600">
                    💡 Choose which user feedbacks should be displayed as testimonials on your landing page. 
                    Select the most positive and detailed responses for maximum impact.
                  </p>
                </div>
                {feedback.map((feedbackItem) => (
                  <div key={feedbackItem._id} className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-medium text-xs sm:text-sm">
                              {(feedbackItem.userId?.name || feedbackItem.userId?.userName || 'A')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {feedbackItem.userId?.name || feedbackItem.userId?.userName || 'Anonymous User'}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {feedbackItem.userId?.email || 'No email provided'}
                            </p>
                          </div>
                        </div>
                        {feedbackItem.rating && (
                          <div className="flex space-x-1 ml-2">
                            {renderStars(feedbackItem.rating)}
                          </div>
                        )}
                      </div>
                      
                      <blockquote className="text-gray-700 text-sm leading-relaxed bg-white p-3 sm:p-4 rounded-lg italic border-l-4 border-emerald-200">
                        "{feedbackItem.message}"
                      </blockquote>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                        <span className="text-xs text-gray-500">
                          Submitted on {new Date(feedbackItem.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <button
                          onClick={() => handleAddFeedbackToTestimonials(feedbackItem._id)}
                          className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2"
                        >
                          <Plus size={16} />
                          <span>Add to Testimonials</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="text-gray-400" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No feedbacks available</h3>
                <p className="text-gray-500 text-sm sm:text-base px-4">
                  Users need to submit feedback before you can add testimonials.
                </p>
              </div>
            )}
          </Modal>

          {/* Delete Dialog */}
          <AlertDialog
            show={showDeleteDialog}
            title="Remove Testimonial"
            message={`Are you sure you want to remove "${testimonialToDelete?.name}'s" testimonial from display? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;