import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RoadmapDisplay() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  useEffect(() => {
    // Animate cards in sequence
    if (roadmap) {
      const timer = setTimeout(() => {
        roadmap.levels.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => new Set([...prev, index]));
          }, index * 200);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [roadmap]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user/roadmap/${id}`);
      setRoadmap(response.data.roadmap);
    } catch (err) {
      setError('Failed to fetch roadmap');
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
            <div className="absolute inset-0 w-16 h-16 m-auto border-4 border-purple-100 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Crafting Your Learning Journey
          </h2>
          <p className="text-gray-600 text-lg">Preparing your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {roadmap.approach.name}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                {roadmap.skill}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-indigo-100 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              {roadmap.approach.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm animate-fade-in-up animation-delay-600">
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H3a2 2 0 00-2 2v14c0 1.1.9 2 2 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                </svg>
                <span className="font-semibold">{roadmap.totalConcepts} Learning Concepts</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold">6 Mastery Levels</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">Created {formatDate(roadmap.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Path */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Learning Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master {roadmap.skill} through this carefully structured progression from fundamentals to advanced expertise
          </p>
        </div>

        {/* Animated Learning Path */}
        <div className="relative">
          {/* Flowing Connection Line */}
          <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-indigo-400 via-purple-400 to-indigo-600 rounded-full opacity-30"></div>
          
          {roadmap.levels.map((level, levelIndex) => {
            const isVisible = visibleCards.has(levelIndex);
            const isActive = activeLevel === levelIndex;
            
            return (
              <div 
                key={levelIndex}
                className={`relative mb-12 transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`}
              >
                {/* Level Number Icon */}
                <div className={`absolute left-4 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg transition-all duration-500 transform hover:scale-110 ${
                  levelIndex % 2 === 0
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  {levelIndex + 1}
                </div>

                {/* Level Content Card */}
                <div className="ml-20">
                  <div 
                    className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl ${
                      isActive 
                        ? 'border-indigo-300 shadow-2xl shadow-indigo-100 scale-[1.02]' 
                        : 'border-gray-100 hover:border-indigo-200'
                    }`}
                    onClick={() => setActiveLevel(activeLevel === levelIndex ? -1 : levelIndex)}
                  >
                    {/* Level Header */}
                    <div className="relative p-8 overflow-hidden">
                      {/* Decorative Elements */}
                      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full transform translate-x-20 -translate-y-20 opacity-10 ${
                        levelIndex % 2 === 0 
                          ? 'bg-gradient-to-br from-indigo-400 to-indigo-600' 
                          : 'bg-gradient-to-br from-purple-400 to-purple-600'
                      }`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-3xl font-bold mb-4 ${
                              levelIndex % 2 === 0
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent'
                                : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
                            }`}>
                              {level.level}
                            </h3>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                              {level.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span className={`flex items-center px-4 py-2 rounded-xl font-medium ${
                                levelIndex % 2 === 0
                                  ? 'bg-indigo-50 text-indigo-600'
                                  : 'bg-purple-50 text-purple-600'
                              }`}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {level.duration}
                              </span>
                              <span className={`flex items-center px-4 py-2 rounded-xl font-medium ${
                                levelIndex % 2 === 0
                                  ? 'bg-gray-50 text-gray-600'
                                  : 'bg-gray-50 text-gray-600'
                              }`}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {level.concepts.length} concepts
                              </span>
                            </div>
                          </div>
                          
                          <div className="ml-8 text-right">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                              levelIndex % 2 === 0
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {isActive ? 'Expanded' : 'Click to explore'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Concepts */}
                    <div className={`transition-all duration-700 ease-in-out ${
                      isActive ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="px-8 pb-8 bg-gradient-to-br from-gray-50 to-white">
                        <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-3 ${
                            levelIndex % 2 === 0 ? 'bg-indigo-500' : 'bg-purple-500'
                          }`}></span>
                          Learning Concepts
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {level.concepts.map((concept, conceptIndex) => (
                            <div
                              key={conceptIndex}
                              className={`group p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                levelIndex % 2 === 0
                                  ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100 hover:border-indigo-300'
                                  : 'bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-xl mr-4 flex items-center justify-center shadow-sm ${
                                  levelIndex % 2 === 0
                                    ? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                                    : 'bg-gradient-to-br from-purple-400 to-purple-600'
                                }`}>
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </div>
                                <span className="font-semibold text-gray-800 text-sm group-hover:text-gray-900 transition-colors duration-200">
                                  {concept}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skills & Career Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Expand Your Horizon
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Discover complementary skills and exciting career opportunities
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Complementary Skills */}
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Complementary Skills</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {roadmap.relatedSkills.complementary.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-shadow duration-200 transform hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Level Skills */}
            <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Next Level Skills</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {roadmap.relatedSkills.nextLevel.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-shadow duration-200 transform hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Career Opportunities */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
            <div className="flex items-center justify-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mr-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Career Opportunities
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {roadmap.relatedSkills.specializations.map((spec, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <h4 className="font-bold text-gray-900 mb-3 text-xl">{spec.role}</h4>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{spec.averageSalary.description}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700 flex items-center">
                        <span className="text-lg mr-2">🇮🇳</span> India
                      </span>
                      <span className="text-sm font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {spec.averageSalary.india}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700 flex items-center">
                        <span className="text-lg mr-2">🇺🇸</span> USA
                      </span>
                      <span className="text-sm font-bold text-blue-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {spec.averageSalary.us}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
