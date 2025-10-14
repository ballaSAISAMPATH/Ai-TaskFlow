import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GraduationCap, Link, Route } from "lucide-react";

export default function RoadmapDisplay() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            setVisibleCards((prev) => new Set([...prev, index]));
          }, index * 150);
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [roadmap]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/roadmap/${id}`
      );
      setRoadmap(response.data.roadmap);
    } catch (err) {
      setError("Failed to fetch roadmap");
      console.error("Error fetching roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 w-8 h-8 m-auto border-t-3 border-green-500 animate-spin rounded-full "></div>
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Loading Roadmap
          </h2>
          <p className="text-gray-600 text-sm">
            Preparing your learning path...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-red-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section - Compact */}
      <div className="border-b bg-green-100 border-gray-200 py-3">
        <div className="max-w-full mx-auto px-3 sm:px-4">
          {/* Main Title */}
          <div className="text-center mb-3">
            <h1 className="text-lg sm:text-xl font-bold text-green-600 uppercase tracking-wide">
              {roadmap.skill}
            </h1>
          </div>

          {/* Approach Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 shadow-sm bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                <GraduationCap className="w-3 h-3" />
                {roadmap.approach.name}
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 shadow-sm bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium max-w-xl">
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="truncate text-xs">{roadmap.approach.description}</span>
            </div>
          </div>

          {/* Stats Badges - Compact */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="inline-flex shadow-sm items-center gap-1.5 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {roadmap.totalConcepts} Concepts
            </span>

            <span className="inline-flex shadow-sm items-center gap-1.5 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              6 Levels
            </span>

            <span className="inline-flex shadow-sm items-center gap-1.5 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(roadmap.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Compact Layout */}
      <div className="max-w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Learning Path */}
          <div className="xl:col-span-8">
            {/* Section Header - Compact */}
            <div className="text-center xl:text-left mb-4 lg:mb-6">
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Learning Journey
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Master {roadmap.skill} through structured progression
              </p>
            </div>

            {/* Learning Path - Compact */}
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-4 sm:left-5 top-0 w-0.5 h-full bg-gradient-to-b from-green-400 via-emerald-400 to-green-600 rounded-full opacity-30"></div>

              {roadmap.levels.map((level, levelIndex) => {
                const isVisible = visibleCards.has(levelIndex);

                return (
                  <div
                    key={levelIndex}
                    className={`relative mb-4 sm:mb-6 transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-6"
                    }`}
                  >
                    {/* Level Number Icon - Compact */}
                    <div className="absolute left-1 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm z-10 shadow-md bg-gradient-to-br from-green-500 to-green-600 transition-all duration-300 transform hover:scale-110">
                      {levelIndex + 1}
                    </div>

                    {/* Level Content Card - Compact */}
                    <div className="ml-10 sm:ml-12">
                      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
                        {/* Level Header - Compact */}
                        <div className="relative p-3 sm:p-4 overflow-hidden">
                          {/* Decorative Elements */}
                          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full transform translate-x-8 sm:translate-x-10 -translate-y-8 sm:-translate-y-10 opacity-10 bg-gradient-to-br from-green-400 to-green-600"></div>

                          <div className="relative z-10">
                            <h3 className="text-base sm:text-lg font-bold mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                              {level.level}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">
                              {level.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center px-2 py-1 rounded-lg font-medium bg-gray-200 text-green-600">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {level.duration}
                              </span>
                              <span className="flex items-center px-2 py-1 rounded-lg font-medium bg-green-100 text-green-600">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                {level.concepts.length} concepts
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Concepts - Compact */}
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-gradient-to-br from-gray-50 to-white">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                            Learning Concepts
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {level.concepts.map((concept, conceptIndex) => (
                              <div
                                key={conceptIndex}
                                className="group p-2 rounded-lg border bg-gradient-to-br from-green-50 to-white border-green-100 hover:border-green-300 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
                              >
                                <div className="flex items-center">
                                  <span className="w-1.5 h-1.5 rounded-full mr-2 bg-green-500"></span>
                                  <span className="font-medium text-gray-800 text-xs group-hover:text-gray-900 transition-colors duration-200">
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
                );
              })}
            </div>
          </div>

          {/* Right Column - Skills - Compact */}
          <div className="xl:col-span-4 space-y-4">
            <div className="sticky top-16">
              <h2 className="text-lg sm:text-xl font-bold text-center xl:text-left mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Expand Skills
              </h2>

              {/* Complementary Skills - Compact */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 mb-4 transform hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <Link className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    Complementary Skills
                  </h3>
                </div>
                <p className="text-gray-900 text-xs mb-3">
                  Skills that enhance {roadmap.skill}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.relatedSkills.complementary.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-200 transform hover:scale-105"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Next Level Skills - Compact */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-green-100 p-3 sm:p-4 transform hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br text-white from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <Route className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    Future Roadmaps
                  </h3>
                </div>
                <p className="text-gray-900 text-xs mb-3">
                  Advanced tracks after {roadmap.skill}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.relatedSkills.nextLevel.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-200 transform hover:scale-105"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Opportunities - Compact */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-0 sm:mr-4 mb-2 sm:mb-0">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent text-center sm:text-left">
                Career Opportunities
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {roadmap.relatedSkills.specializations.map((spec, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                    {spec.role}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {spec.averageSalary.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                      <span className="text-xs font-medium text-gray-700 flex items-center">
                        <span className="text-sm mr-1.5">🇮🇳</span>
                        India
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">
                        {spec.averageSalary.india}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <span className="text-xs font-medium text-gray-700 flex items-center">
                        <span className="text-sm mr-1.5">🇺🇸</span>
                        USA
                      </span>
                      <span className="text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-sm">
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
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
