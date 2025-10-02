import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AllRoadmaps() {
  const user = useSelector((state) => state.auth.user);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    skill: '',
    approach: '',
    page: 1
  });

  // Fetch user roadmaps
  useEffect(() => {
    fetchUserRoadmaps();
    fetchUserStats();
  }, [filters]);

  const fetchUserRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/user/${user.id}/roadmaps`,
        {
          params: {
            limit: 12,
            page: filters.page,
            skill: filters.skill,
            approach: filters.approach
          }
        }
      );
      setRoadmaps(response.data.roadmaps);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roadmaps');
      console.error('Error fetching roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${user.id}/roadmaps/stats`
      );
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDelete = async (roadmapId) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/roadmap/${roadmapId}`, {
        data: { userId: user.id }
      });
      fetchUserRoadmaps(); // Refresh list
      fetchUserStats(); // Refresh stats
    } catch (err) {
      alert('Failed to delete roadmap');
    }
  };

  const handleVisibilityToggle = async (roadmapId, currentVisibility) => {
    try {
      await axios.put(`http://localhost:5000/roadmap/${roadmapId}/visibility`, {
        isPublic: !currentVisibility,
        userId: user.id
      });
      fetchUserRoadmaps(); // Refresh list
    } catch (err) {
      alert('Failed to update visibility');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && roadmaps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">Loading your roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                My Learning Roadmaps 🗺️
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Track your learning journey and progress
              </p>
            </div>
            <Link
              to="/user/road-map/create-roadmap"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Roadmap
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalRoadmaps || 0}</p>
                <p className="text-sm text-gray-600">Total Roadmaps</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews || 0}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalLikes || 0}</p>
                <p className="text-sm text-gray-600">Total Likes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.publicRoadmaps || 0}</p>
                <p className="text-sm text-gray-600">Public Roadmaps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Skill</label>
              <input
                type="text"
                value={filters.skill}
                onChange={(e) => setFilters({ ...filters, skill: e.target.value, page: 1 })}
                placeholder="Search skills..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Approach</label>
              <select
                value={filters.approach}
                onChange={(e) => setFilters({ ...filters, approach: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Approaches</option>
                <option value="complete-mastery">Complete Mastery</option>
                <option value="interview-prep">Interview Preparation</option>
                <option value="quick-recap">Quick Recap</option>
                <option value="project-focused">Project-Based Learning</option>
                <option value="certification-prep">Certification Preparation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && roadmaps.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No roadmaps found</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by creating your first roadmap!</p>
            <Link
              to="/user/road-map/create-roadmap"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              Create Your First Roadmap
            </Link>
          </div>
        )}

        {/* Roadmaps Grid */}
        {roadmaps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                className="bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 truncate">{roadmap.skill}</h3>
                  <div className="flex items-center justify-between text-green-100">
                    <span className="text-sm">{roadmap.totalConcepts} concepts</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs">{roadmap.views}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-xs">{roadmap.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Learning Approach:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        roadmap.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {roadmap.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">{roadmap.approach.name}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{roadmap.approach.description}</p>
                  </div>

                  <div className="text-xs text-gray-500 mb-6">
                    Created on {formatDate(roadmap.generatedAt)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/roadmap/${roadmap._id}`}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      View Details
                    </Link>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVisibilityToggle(roadmap._id, roadmap.isPublic)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title={roadmap.isPublic ? 'Make Private' : 'Make Public'}
                      >
                        {roadmap.isPublic ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(roadmap._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Roadmap"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State for Additional Pages */}
        {loading && roadmaps.length > 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
