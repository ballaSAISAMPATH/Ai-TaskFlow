import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Target, Zap } from 'lucide-react'

const MapHeader = ({ selectedGoal, completed, total, percentage }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white shadow-md border-b-2 border-green-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-black hover:bg-gray-100 rounded-xl px-4 py-2 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black truncate mb-2">
              {selectedGoal.goalTitle}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{selectedGoal.totalDays} days</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{selectedGoal.duration}</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{total} levels</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-green-600 font-bold text-xl lg:text-2xl">
              {percentage}%
            </div>
            <div className="text-gray-600 text-sm">
              {completed}/{total} complete
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Adventure Progress</span>
            <span className="text-black text-sm font-medium">{percentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-5 rounded-full transition-all duration-700 relative overflow-hidden shadow-sm"
              style={{ width: `${percentage}%` }}
            >
              {percentage > 0 && (
                <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
              )}
              {percentage > 15 && (
                <div className="absolute inset-0 flex items-center justify-end pr-4">
                  <Zap className="w-4 h-4 text-white animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapHeader