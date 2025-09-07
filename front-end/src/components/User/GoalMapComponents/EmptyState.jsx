import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Play } from 'lucide-react'

const EmptyState = ({ goalId }) => {
  const navigate = useNavigate()

  return (
    <div className="text-center py-20 px-4">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <Target className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-black mb-4">No Adventures Available</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start your journey by adding some tasks to your goal. Every great adventure begins with a single step!
      </p>
      <button
        onClick={() => navigate(`/user/goal/${goalId}`)}
        className="bg-green-500 text-white px-8 py-4 rounded-full font-medium hover:bg-green-600 transition-all duration-200 shadow-lg transform hover:scale-105"
      >
        <Play className="w-5 h-5 inline mr-2" />
        Start Your Adventure
      </button>
    </div>
  )
}

export default EmptyState