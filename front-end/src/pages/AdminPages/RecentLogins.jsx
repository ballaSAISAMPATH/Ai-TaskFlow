import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentLogins } from '@/store/recent-login';
const RecentLogins = () => {
  const dispatch = useDispatch();
  const { recentLogins, loading, error } = useSelector((state) => state.loginHistory);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchRecentLogins());
    }
  }, [dispatch, user]);

  if (user?.role !== 'admin') {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SkeletonRow = () => (
    <div className="flex items-center space-x-4 p-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="text-right space-y-1">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-xl font-bold text-black">Recent Activity</h2>
            <p className="text-gray-600 text-sm">Latest user logins and sessions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(6)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Unable to Load Data</h3>
              <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">{error}</p>
              <button
                onClick={() => dispatch(fetchRecentLogins())}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            </div>
          ) : !recentLogins || recentLogins.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">No Recent Activity</h3>
              <p className="text-gray-600 text-sm">User login history will appear here once users start logging in</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLogins && recentLogins.map((login, index) => (
                <div
                  key={`${login.email}-${index}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <span className="text-white font-bold text-sm">
                        {getInitials(login.name)}
                      </span>
                    </div>
                    {!login.isUserDeleted && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-black truncate">{login.name}</p>
                      {login.isUserDeleted && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Deleted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">{login.email}</p>
                  </div>

                  {/* Time */}
                  <div className="text-right ml-4">
                    <p className="text-black text-sm font-medium">
                      {formatDate(login.lastLogin)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatTime(login.lastLogin)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && !error && recentLogins && recentLogins.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">
                  {recentLogins.length} recent {recentLogins.length === 1 ? 'login' : 'logins'}
                </span>
              </div>
              <button
                onClick={() => dispatch(fetchRecentLogins())}
                className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentLogins;
