import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStatistics, deleteUser } from '@/store/admin';
import { 
  Users, 
  Target, 
  CheckCircle, 
  MessageSquare, 
  Trash2, 
  Calendar, 
  TrendingUp,
  User,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

// Skeleton Loading Component
const UserStatisticsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-4 sm:h-5 lg:h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 mb-1"></div>
            <div className="hidden sm:flex items-center space-x-2 mt-1">
              <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded"></div>
          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div className="sm:hidden mt-2 flex items-center space-x-2">
        <div className="h-3 w-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Loading Container Component
const LoadingContainer = ({ children }) => (
  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">User Statistics</h1>
      </div>
      <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
    </div>

    {/* Search Bar Skeleton */}
    <div className="bg-white rounded-lg shadow-md p-1 sm:p-2 border border-gray-200">
      <div className="w-full p-2 sm:p-3 h-10 sm:h-12 bg-gray-200 rounded-md animate-pulse"></div>
    </div>

    {/* Content */}
    {children}
  </div>
);

const UsersTaskStatistics = () => {
  const dispatch = useDispatch();
  const { users, usersPagination, usersLoading, usersError } = useSelector(state => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [isPageChanging, setIsPageChanging] = useState(false);

  useEffect(() => {
    // Set page changing state when navigating to a different page
    if (currentPage !== 1) {
      setIsPageChanging(true);
    }
    
    dispatch(fetchUserStatistics({ page: currentPage, limit: 10 }))
      .then(() => {
        setIsPageChanging(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        setIsPageChanging(false);
      });
  }, [dispatch, currentPage]);

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("User deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Error occurred while deleting");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setIsPageChanging(true);
      setCurrentPage(newPage);
      // Clear expanded users when changing pages
      setExpandedUsers(new Set());
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getProgressDisplay = (completed, total, type) => {
    if (total === 0) {
      return `No ${type.toLowerCase()} added yet`;
    }
    return `${getProgressPercentage(completed, total)}%`;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show skeleton loading for initial load (page 1) or when loading with no data
  if ((usersLoading && currentPage === 1) || (usersLoading && users.length === 0)) {
    return (
      <LoadingContainer>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, index) => (
            <UserStatisticsSkeleton key={index} />
          ))}
        </div>
      </LoadingContainer>
    );
  }

  // Show skeleton loading when changing pages
  if (isPageChanging || usersLoading) {
    return (
      <LoadingContainer>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, index) => (
            <UserStatisticsSkeleton key={`page-change-${index}`} />
          ))}
        </div>
      </LoadingContainer>
    );
  }

  if (usersError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 sm:mx-0">
        <p className="text-red-600 text-sm sm:text-base">Error: {usersError}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">User Statistics</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Total Users: {usersPagination?.totalUsers || 0}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-1 sm:p-2 border border-gray-200">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Users Statistics Cards */}
      <div className="space-y-3 sm:space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-200">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-sm sm:text-base text-gray-500">
              {searchTerm ? 'No users match your search criteria.' : 'No users have registered yet.'}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isExpanded = expandedUsers.has(user._id);
            return (
              <div key={user._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* User Header - Always Visible */}
                <div 
                  className="p-3 sm:p-4 lg:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleUserExpansion(user._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs sm:text-sm lg:text-lg">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                        <div className="hidden sm:flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-500">
                            Joined {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                      <div className="p-1.5 sm:p-2 text-gray-600 rounded-lg">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(user);
                        }}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile date - shown when collapsed */}
                  <div className="sm:hidden mt-2 flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Expandable Content */}
                <div className={`border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {/* Statistics Grid */}
                  <div className="p-3 sm:p-4 lg:p-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                        {/* Total Goals */}
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                            <div className="bg-green-500 p-1.5 sm:p-2 rounded-lg w-fit">
                              <Target className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm text-gray-500">Total Goals</p>
                              <p className="text-lg sm:text-xl font-bold text-green-600">
                                {user.statistics.totalGoals}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Completed Goals */}
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                            <div className="bg-green-500 p-1.5 sm:p-2 rounded-lg w-fit">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm text-gray-500">Completed Goals</p>
                              <p className="text-lg sm:text-xl font-bold text-green-600">
                                {user.statistics.completedGoals}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Total Tasks */}
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                            <div className="bg-green-500 p-1.5 sm:p-2 rounded-lg w-fit">
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm text-gray-500">Total Tasks</p>
                              <p className="text-lg sm:text-xl font-bold text-green-600">
                                {user.statistics.totalTasks}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Count */}
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                            <div className="bg-green-500 p-1.5 sm:p-2 rounded-lg w-fit">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm text-gray-500">Feedback</p>
                              <p className="text-lg sm:text-xl font-bold text-green-600">
                                {user.statistics.totalFeedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                        {/* Goal Completion Rate */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Goal Completion Rate</span>
                            <span className={`text-xs sm:text-sm font-semibold ${
                              user.statistics.totalGoals === 0 ? 'text-gray-500' : 'text-green-600'
                            }`}>
                              {getProgressDisplay(user.statistics.completedGoals, user.statistics.totalGoals, 'Goals')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                user.statistics.totalGoals === 0 ? 'bg-gray-400' : 'bg-green-500'
                              }`}
                              style={{ 
                                width: user.statistics.totalGoals === 0 ? '100%' : `${getProgressPercentage(user.statistics.completedGoals, user.statistics.totalGoals)}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Task Completion Rate */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Task Completion Rate</span>
                            <span className={`text-xs sm:text-sm font-semibold ${
                              user.statistics.totalTasks === 0 ? 'text-gray-500' : 'text-green-600'
                            }`}>
                              {getProgressDisplay(user.statistics.completedTasks, user.statistics.totalTasks, 'Tasks')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                user.statistics.totalTasks === 0 ? 'bg-gray-400' : 'bg-green-500'
                              }`}
                              style={{ 
                                width: user.statistics.totalTasks === 0 ? '100%' : `${getProgressPercentage(user.statistics.completedTasks, user.statistics.totalTasks)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Stats */}
                      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                        <p>Completed Tasks: {user.statistics.completedTasks} / {user.statistics.totalTasks}</p>
                      </div>
                    </div>
                  </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {usersPagination && usersPagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isPageChanging}
            className="w-full sm:w-auto px-3 py-2 text-sm border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1 overflow-x-auto max-w-full">
            {Array.from({ length: Math.min(usersPagination.totalPages, 5) }, (_, i) => {
              let page;
              if (usersPagination.totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= usersPagination.totalPages - 2) {
                page = usersPagination.totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isPageChanging}
                  className={`px-2 sm:px-3 cursor-pointer py-2 text-sm rounded-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
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
            onClick={() => handlePageChange(Math.min(currentPage + 1, usersPagination.totalPages))}
            disabled={currentPage === usersPagination.totalPages || isPageChanging}
            className="w-full sm:w-auto px-3 py-2 cursor-pointer text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
              This action will permanently remove the user and all their associated data including goals and feedback. 
              This cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => handleDeleteUser(deleteConfirm._id)}
                className="w-full sm:flex-1 bg-red-600 text-white py-2 px-4 text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-2 px-4 text-sm rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTaskStatistics;