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
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="flex space-x-1">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
    
    <div className="border-t border-gray-100 pt-3">
      <div className="h-3 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

const FeedbackSkeleton = () => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
          <div className="flex space-x-1">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border-l-4 border-gray-200 mb-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
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
        size={16} 
        className={`${i < rating ? 'text-green-600 fill-green-600' : 'text-gray-300'}`}
      />
    ));
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl m-4 max-h-[80vh] overflow-hidden flex flex-col border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const AlertDialog = ({ show, onConfirm, onCancel, title, message }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
            <p className="text-gray-600 mt-2">Select feedbacks to display as testimonials on your landing page</p>
          </div>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-700 hover:cursor-pointer text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
          >
            <Plus size={20} />
            <span>Select from Feedbacks</span>
          </button>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Current Testimonials
            </h2>
            {!loading && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {testimonials.length} testimonials
              </span>
            )}
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, index) => (
                <TestimonialSkeleton key={index} />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Star className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
              <p className="text-gray-500 mb-4">Start by selecting some feedbacks to display as testimonials</p>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Select Feedbacks
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h3>
                      <div className="flex mt-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(testimonial)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
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
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    page === pagination.currentPage
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <Modal 
          show={showFeedbackModal} 
          onClose={() => setShowFeedbackModal(false)}
          title="Select Feedbacks to Display as Testimonials"
        >
          <div className="flex-1 overflow-y-auto">
            {feedbackLoading ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 animate-pulse">
                  <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                </div>
                {Array(4).fill(0).map((_, index) => (
                  <FeedbackSkeleton key={index} />
                ))}
              </div>
            ) : feedback && feedback.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  💡 Choose which user feedbacks should be displayed as testimonials on your landing page. 
                  Select the most positive and detailed responses for maximum impact.
                </p>
                {feedback.map((feedbackItem) => (
                  <div key={feedbackItem._id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">
                                {(feedbackItem.userId?.name || feedbackItem.userId?.userName || 'A')[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {feedbackItem.userId?.name || feedbackItem.userId?.userName || 'Anonymous User'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {feedbackItem.userId?.email || 'No email provided'}
                              </p>
                            </div>
                          </div>
                          {feedbackItem.rating && (
                            <div className="flex space-x-1">
                              {renderStars(feedbackItem.rating)}
                            </div>
                          )}
                        </div>
                        
                        <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 bg-white p-4 rounded-lg italic border-l-4 border-emerald-200">
                          "{feedbackItem.message}"
                        </blockquote>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Submitted on {new Date(feedbackItem.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <button
                            onClick={() => handleAddFeedbackToTestimonials(feedbackItem._id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors shadow-sm flex items-center space-x-2"
                          >
                            <Plus size={16} />
                            <span>Add to Testimonials</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedbacks available</h3>
                <p className="text-gray-500">Users need to submit feedback before you can add testimonials.</p>
              </div>
            )}
          </div>
        </Modal>

        <AlertDialog
          show={showDeleteDialog}
          title="Remove Testimonial"
          message={`Are you sure you want to remove "${testimonialToDelete?.name}'s" testimonial from display? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
};

export default AdminTestimonials;