import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RoadmapDisplay() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [completedConcepts, setCompletedConcepts] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  useEffect(() => {
    calculateProgress();
  }, [completedConcepts, roadmap]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user/roadmap/${id}`);
      setRoadmap(response.data.roadmap);
      
      // Load saved progress from localStorage
     
    } catch (err) {
      setError('Failed to fetch roadmap');
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!roadmap) return;
    
    const totalConcepts = roadmap.totalConcepts;
    const completedCount = Object.values(completedConcepts).filter(Boolean).length;
    const progress = Math.round((completedCount / totalConcepts) * 100);
    setOverallProgress(progress);
  };

  const toggleConcept = (levelIndex, conceptIndex) => {
    const key = `${levelIndex}-${conceptIndex}`;
    const newCompletedConcepts = {
      ...completedConcepts,
      [key]: !completedConcepts[key]
    };
    setCompletedConcepts(newCompletedConcepts);
    
    // Save to localStorage
    localStorage.setItem(`roadmap-progress-${id}`, JSON.stringify(newCompletedConcepts));
  };

  const getLevelProgress = (levelIndex) => {
    if (!roadmap) return 0;
    
    const level = roadmap.levels[levelIndex];
    const completedInLevel = level.concepts.filter((_, conceptIndex) => 
      completedConcepts[`${levelIndex}-${conceptIndex}`]
    ).length;
    
    return Math.round((completedInLevel / level.concepts.length) * 100);
  };

  const isLevelUnlocked = (levelIndex) => {
    if (levelIndex === 0) return true;
    return getLevelProgress(levelIndex - 1) >= 80; // Unlock when previous level is 80% complete
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">Loading your learning roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-400 bg-opacity-30 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {roadmap.approach.name}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {roadmap.skill} Mastery Path
            </h1>
            
            <p className="text-xl text-green-100 mb-6 max-w-3xl mx-auto">
              {roadmap.approach.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {roadmap.totalConcepts} Concepts
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                6 Levels
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {formatDate(roadmap.generatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Progress</h2>
              <p className="text-gray-600">Keep going! You're making great progress.</p>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                      className="text-green-500 transition-all duration-500 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Completed: {Object.values(completedConcepts).filter(Boolean).length} concepts
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  Remaining: {roadmap.totalConcepts - Object.values(completedConcepts).filter(Boolean).length} concepts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-200 via-green-400 to-green-600"></div>
          
          {roadmap.levels.map((level, levelIndex) => {
            const levelProgress = getLevelProgress(levelIndex);
            const isUnlocked = isLevelUnlocked(levelIndex);
            const isActive = activeLevel === levelIndex;
            
            return (
              <div key={levelIndex} className="relative mb-12">
                {/* Level Icon */}
                <div className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 transition-all duration-300 ${
                  levelProgress === 100 
                    ? 'bg-green-500 shadow-lg shadow-green-200' 
                    : isUnlocked 
                      ? 'bg-green-400' 
                      : 'bg-gray-300'
                }`}>
                  {levelProgress === 100 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isUnlocked ? (
                    levelIndex + 1
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>

                {/* Level Content */}
                <div className="ml-20">
                  <div 
                    className={`bg-white rounded-xl shadow-lg border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'border-green-400 shadow-xl shadow-green-100' 
                        : 'border-green-100 hover:border-green-300'
                    } ${!isUnlocked ? 'opacity-60' : ''}`}
                    onClick={() => isUnlocked && setActiveLevel(activeLevel === levelIndex ? -1 : levelIndex)}
                  >
                    {/* Level Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h3>
                          <p className="text-gray-600 mb-3">{level.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {level.duration}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {level.concepts.length} concepts
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-2">{levelProgress}%</div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                              style={{ width: `${levelProgress}%` }}
                            ></div>
                          </div>
                          
                          {!isUnlocked && (
                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Complete previous level to unlock
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Concepts */}
                    <div className={`transition-all duration-500 ease-in-out ${
                      isActive ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Learning Concepts</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {level.concepts.map((concept, conceptIndex) => {
                            const isCompleted = completedConcepts[`${levelIndex}-${conceptIndex}`];
                            
                            return (
                              <div
                                key={conceptIndex}
                                className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                  isCompleted 
                                    ? 'bg-green-50 border-green-200 text-green-800' 
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                } ${!isUnlocked ? 'pointer-events-none' : ''}`}
                                onClick={() => isUnlocked && toggleConcept(levelIndex, conceptIndex)}
                              >
                                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors duration-200 ${
                                  isCompleted 
                                    ? 'bg-green-500 border-green-500' 
                                    : 'border-gray-300 hover:border-green-400'
                                }`}>
                                  {isCompleted && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`font-medium ${isCompleted ? 'line-through text-green-700' : 'text-gray-700'}`}>
                                  {concept}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Related Skills & Career Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Complementary Skills */}
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Complementary Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {roadmap.relatedSkills.complementary.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Next Level Skills */}
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Next Level Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {roadmap.relatedSkills.nextLevel.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Career Specializations */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-7 h-7 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            Career Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmap.relatedSkills.specializations.map((spec, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
              >
                <h4 className="font-bold text-gray-900 mb-2">{spec.role}</h4>
                <p className="text-sm text-gray-600 mb-4">{spec.averageSalary.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">🇮🇳 India:</span>
                    <span className="text-sm font-bold text-green-600">{spec.averageSalary.india}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">🇺🇸 USA:</span>
                    <span className="text-sm font-bold text-green-600">{spec.averageSalary.us}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
