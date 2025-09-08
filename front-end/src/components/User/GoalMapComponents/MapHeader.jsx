import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Target } from "lucide-react";

const MapHeader = ({ selectedGoal, completed, total, percentage }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md border-b-2 border-green-200">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-black hover:bg-gray-100 rounded-lg px-3 py-2 text-sm sm:text-base transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span>Back</span>
          </button>

          {/* Goal Title + Info */}
          <div className="flex-1 text-center">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2 leading-snug break-words">
              {selectedGoal.goalTitle}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 text-gray-600 text-xs sm:text-sm">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{selectedGoal.totalDays} days</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{selectedGoal.duration}</span>
              </div>
              <div className="flex items-center">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{total} levels</span>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="text-right text-sm sm:text-base">
            <div className="text-green-600 font-bold text-lg sm:text-xl md:text-2xl">
              {percentage}%
            </div>
            <div className="text-gray-600">
              {completed}/{total} complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 md:h-4">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 sm:h-3 md:h-4 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
