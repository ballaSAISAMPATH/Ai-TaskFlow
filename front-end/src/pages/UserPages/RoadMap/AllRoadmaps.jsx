import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChartColumnIncreasing, Footprints, Plus, Route } from 'lucide-react';

export default function AllRoadmaps() {
  const user = useSelector((state) => state.auth.user);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRoadmaps, setTotalRoadmaps] = useState(0);
  const [filters, setFilters] = useState({
    skill: '',
    approach: '',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState('grid');

  // Fetch user roadmaps
  useEffect(() => {
    fetchUserRoadmaps();
  }, [filters]);

  const fetchUserRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user.id}/roadmaps`,
        {
          params: {
            skill: filters.skill,
            approach: filters.approach,
            sortBy: filters.sortBy
          }
        }
      );
      setTotalRoadmaps(response.data.roadmaps.length);
      console.log(response.data.roadmaps);
      
      setRoadmaps(response.data.roadmaps);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roadmaps');
      console.error('Error fetching roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/roadmap/${roadmapId}`, {
        data: { userId: user.id }
      });
      fetchUserRoadmaps();
      fetchUserStats();
    } catch (err) {
      alert('Failed to delete roadmap');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getApproachBadgeColor = (approach) => {
    const colors = {
      'Complete Mastery': 'bg-green-100 text-green-800 border-green-200',
      'Interview Preparation': 'bg-blue-100 text-blue-800 border-blue-200',
      'Quick Recap': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Project-Based Learning': 'bg-purple-100 text-purple-800 border-purple-200',
      'Certification Preparation': 'bg-red-100 text-red-800 border-red-200',
      'Strong Foundation': 'bg-teal-100 text-teal-800 border-teal-200',
      'Practical Skills Only': 'bg-orange-100 text-orange-800 border-orange-200',
      'Competitive Programming': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Academic/Theoretical': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[approach] || 'bg-green-100 text-green-800 border-green-200';
  };

  if (loading && roadmaps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative flex justify-center">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-500 mb-6"></div>
          </div>
          <div className="text-green-700 text-xl font-semibold">Loading Your Roadmaps</div>
          <div className="text-green-600 text-sm mt-2">Preparing your learning journey...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  My Learning Roadmaps
                </h1>
              </div>
              <p className="text-sm sm:text-lg text-gray-600 flex items-center space-x-2">
                <span>Navigate your personalized learning journey</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {roadmaps.length} Active Paths
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/user/road-map/create-roadmap"
                className="group  shadow-black/50 relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <Plus/>
                  </svg>
                  Create New Roadmap
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Roadmaps', 
              value: totalRoadmaps, 
              icon: (
                <Route />
              ),
              color: 'from-yellow-500 to-yellow-600',
              bgColor: 'bg-green-50',
              textColor: 'text-green-600'
            },
            { 
              label: 'Concepts Mapped', 
              value: roadmaps.reduce((sum, rm) => sum + (rm.totalConcepts || 0), 0), 
              icon: (
                <ChartColumnIncreasing />
              ),
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              textColor: 'text-blue-600'
            },
            { 
              label: 'Learning Hours', 
              value: Math.round(roadmaps.length * 45.5), 
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-50',
              textColor: 'text-purple-600'
            },
            { 
              label: 'Approach Types', 
              value: 0, 
              icon: (
                <Footprints />
              ),
              color: 'from-orange-500 to-orange-600',
              bgColor: 'bg-orange-50',
              textColor: 'text-orange-600',
            }
          ].map((stat, index) => (
            <div key={index} className={`${stat.bgColor} border-2 border-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                    {stat.value}
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>

        {/* Advanced Control Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Filter & Sort</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">View Mode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Search Skills</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.skill}
                  onChange={(e) => {}}
                  placeholder="Type to search..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Learning Approach</label>
              <select
                value={filters.approach}
                onChange={(e) => {}}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="">All Approaches</option>
                <option value="complete-mastery">Complete Mastery</option>
                <option value="interview-prep">Interview Preparation</option>
                <option value="quick-recap">Quick Recap</option>
                <option value="project-focused">Project-Based Learning</option>
                <option value="certification-prep">Certification Prep</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => {}}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="concepts">Most Complex</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Roadmaps</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && roadmaps.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No Roadmaps Yet</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">Start your learning journey by creating your first personalized roadmap!</p>
            <Link
              to="/user/road-map/create-roadmap"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Roadmap
            </Link>
          </div>
        )}

        {/* Roadmaps Display */}
        {roadmaps.length > 0 && (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : 
            "space-y-6"
          }>
            {roadmaps.map((roadmap, index) => {
              return (
                <div
                  key={roadmap._id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${viewMode === 'list' ? 'flex items-center' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-br from-green-500 to-green-600 text-white relative overflow-hidden ${viewMode === 'list' ? 'w-1/3 min-h-full flex items-center' : 'p-8'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
                    <div className={`relative z-10 ${viewMode === 'list' ? 'p-8' : ''}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">
                          {roadmap.skill}
                        </h3>
                       
                      </div>
                      <div className="flex items-center justify-between text-green-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-semibold">{roadmap.totalConcepts}</span>
                            <span className="text-sm ml-1">concepts</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">~{Math.round(roadmap.totalConcepts * 1.5)}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={`p-8 flex-1 ${viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-6'}`}>
                    <div className={viewMode === 'list' ? 'flex-1 pr-8' : ''}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getApproachBadgeColor(roadmap.approach.name)}`}>
                          {roadmap.approach.name}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          roadmap.isPublic 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {roadmap.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {roadmap.approach.description}
                      </p>

                      <div className="text-xs text-gray-500 mb-6 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created {formatDate(roadmap.createdAt)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex ${viewMode === 'list' ? 'space-x-3' : 'flex-col sm:flex-row gap-4'}`}>
                      <Link
                        to={`/user/road-map/displayDetailedRoadmap/${roadmap._id}`}
                        className="group relative flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          View Roadmap
                        </span>
                      </Link>
                      
                      <div className="flex space-x-2">
                        {/* <button
                          onClick={() => handleVisibilityToggle(roadmap._id, roadmap.isPublic)}
                          className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 rounded-xl transition-all duration-300"
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
                        </button> */}
                        
                        <button
                          onClick={() => handleDelete(roadmap._id)}
                          className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-xl transition-all duration-300"
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
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && roadmaps.length > 0 && (
          <div className="text-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin border-t-green-500 mx-auto"></div>
              <div className="absolute inset-0 w-8 h-8 m-auto border-4 border-green-100 rounded-full animate-ping"></div>
            </div>
            <p className="text-green-600 text-lg font-medium mt-4">Loading more roadmaps...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
