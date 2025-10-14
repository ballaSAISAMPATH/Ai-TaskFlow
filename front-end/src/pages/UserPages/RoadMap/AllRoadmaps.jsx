import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChartColumnIncreasing, Footprints, Plus, Route, Search } from 'lucide-react';

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
  }, []);

  const fetchUserRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user.id}/roadmaps`);
      setTotalRoadmaps(response.data.roadmaps.length);
      setRoadmaps(response.data.roadmaps);
      console.log(response.data.roadmaps);
      
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

  // Filter and sort roadmaps
  const getFilteredAndSortedRoadmaps = () => {
    let filteredRoadmaps = roadmaps.filter(roadmap => {
      const matchesSkill = filters.skill.length === 0 || 
        roadmap.skill.toLowerCase().includes(filters.skill.toLowerCase());
      const matchesApproach = filters.approach.length === 0 || 
        roadmap.approach.id === filters.approach;
      
      return matchesSkill && matchesApproach;
    });

    // Sort roadmaps based on sortBy filter
    const sortedRoadmaps = [...filteredRoadmaps].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'alphabetical':
          return a.skill.toLowerCase().localeCompare(b.skill.toLowerCase());
        default:
          return 0;
      }
    });

    return sortedRoadmaps;
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

  const filteredAndSortedRoadmaps = getFilteredAndSortedRoadmaps();

  return (
    <div className="min-h-screen pt-13 bg-gradient-to-br from-green-200 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-white border-b shadow-lg shadow-black/30 border-green-100">
        <div className="max-w-full mx-auto px-4 py-4 pt-8">
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
              <p className="text-sm sm:text-md text-gray-600 flex items-center space-x-1">
                <span>Navigate your personalized learning journey</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[12px] font-medium">
                  {filteredAndSortedRoadmaps.length} Active Paths
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/user/road-map/create-roadmap"
                className="group text-sm shadow-black/50 relative px-4 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <Plus/>
                  </svg>
                  Create New Roadmap
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 py-4">
        {/* Enhanced Stats Cards - Reduced Size */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {[
            { 
              label: 'Total Roadmaps', 
              value: totalRoadmaps, 
              icon: <Route className="w-5 h-5" />,
              color: 'from-red-500 to-red-600',
              bgColor: 'bg-red-100',
              textColor: 'text-red-600'
            },
            { 
              label: 'Concepts Mapped', 
              value: roadmaps.reduce((sum, rm) => sum + (rm.totalConcepts || 0), 0), 
              icon: <ChartColumnIncreasing className="w-5 h-5" />,
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-100',
              textColor: 'text-blue-600'
            },
            { 
              label: 'Learning Hours', 
              value: roadmaps.reduce((sum, rm) => sum + (rm.totalConcepts || 0), 0) * 1.5,
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-100',
              textColor: 'text-purple-600'
            },
            { 
              label: 'Approach Types', 
              value: new Set(roadmaps.map(rm => rm.approach.name)).size, 
              icon: <Footprints className="w-5 h-5" />,
              color: 'from-orange-500 to-orange-600',
              bgColor: 'bg-orange-100',
              textColor: 'text-orange-600',
            }
          ].map((stat, index) => (
            <div key={index} className={`${stat.bgColor} flex justify-between border-2 border-white rounded-xl p-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center gap-1 justify-start">
                <div className={`w-5 h-5 rounded-xl ${stat.textColor} shadow-md`}>
                  {stat.icon}
                </div>
                <h3 className="text-[10px] font-semibold text-gray-700">{stat.label}</h3>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Control Panel */}
        <div className="bg-transparent rounded-2xl shadow-lg border border-green-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div className="relative flex justify-center items-center">
              <div className="absolute left-4 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={filters.skill}
                onChange={(e) => {setFilters({...filters, skill: e.target.value})}}
                placeholder="Type to search..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="flex items-center">
              <select
                value={filters.approach}
                onChange={(e) => {setFilters({...filters, approach: e.target.value});}}
                className="w-full text-gray-800 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="">All Approaches</option>
                <option value="complete-mastery">Complete Mastery</option>
                <option value="interview-prep">Interview Preparation</option>
                <option value="quick-recap">Quick Recap</option>
                <option value="project-focused">Project-Based Learning</option>
                <option value="certification-prep">Certification Preparation</option>
                <option value="foundation-building">Strong Foundation</option>
                <option value="practical-skills">Practical Skills</option>
                <option value="competitive-programming">Competitive Programming</option>
                <option value="academic-study">Academic/Theoretical</option>
              </select>
            </div>

            <div className="space-y-2">
              <select
                value={filters.sortBy}
                onChange={(e) => {setFilters({...filters, sortBy: e.target.value})}}
                className="w-full flex items-center px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>  
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm me-3 text-gray-500">View Mode:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md rounded-e-none text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-green-500 text-white shadow-md' 
                      :  'bg-gray-300 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md rounded-s-none text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'bg-gray-300 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List
                </button>            
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

        {/* No Results State */}
        {!loading && roadmaps.length > 0 && filteredAndSortedRoadmaps.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Roadmaps Found</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more roadmaps.
            </p>
            <button
              onClick={() => setFilters({ skill: '', approach: '', sortBy: 'newest' })}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Roadmaps Display */}
        {filteredAndSortedRoadmaps.length > 0 && (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" : 
            "space-y-3"
          }>
            {filteredAndSortedRoadmaps.map((roadmap, index) => (
              <div
                key={roadmap._id}
                className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex items-stretch' : 'flex flex-col h-full'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header Section - Reduced Size */}
                <div className={`relative bg-gradient-to-br from-green-500 to-green-600 text-white ${
                  viewMode === 'list' ? 'w-72 flex-shrink-0' : 'pb-4'
                }`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/20 rounded-full transform -translate-x-6 translate-y-6"></div>
                  </div>

                  <div className="relative p-4">
                    {/* Skill Title */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg capitalize font-bold leading-tight pr-2">
                        {roadmap.skill}
                      </h3>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          roadmap.isPublic 
                            ? 'bg-white/20 text-white border-white/30' 
                            : 'bg-black/20 text-white border-white/30'
                        }`}>
                          {roadmap.isPublic ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Public
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-15a2.998 2.998 0 00-2.83 2H6a2 2 0 00-2 2v10a2 2 0 002 2h1.17A2.998 2.998 0 0010 17h4a2.998 2.998 0 002.83-2H18a2 2 0 002-2V7a2 2 0 00-2-2h-1.17A2.998 2.998 0 0016 3H8z" />
                              </svg>
                              Private
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-green-100">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-semibold text-white text-sm">{roadmap.totalConcepts}</span>
                        <span className="text-xs ml-1">concepts</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-white">~{Math.round(roadmap.totalConcepts * 1.5)}h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section - Reduced Size */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex items-center' : 'flex-1 flex flex-col'}`}>
                  <div className={`${viewMode === 'list' ? 'flex-1 pr-4' : 'flex-1'}`}>
                    {/* Approach Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getApproachBadgeColor(roadmap.approach.name)}`}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></div>
                        {roadmap.approach.name}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                      {roadmap.approach.description}
                    </p>

                    {/* Created Date */}
                    <div className="text-xs text-gray-500 flex items-center mb-4">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created {formatDate(roadmap.createdAt)}
                    </div>
                  </div>

                  {/* Action Buttons - Reduced Size */}
                  <div className={`flex ${viewMode === 'list' ? 'space-x-2' : 'mt-auto space-x-2'}`}>
                    <Link
                      to={`/user/road-map/displayDetailedRoadmap/${roadmap._id}`}
                      className="flex-1 group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-center py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center">
                        View Roadmap
                        <svg className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(roadmap._id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-all duration-200 group"
                      title="Delete Roadmap"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
