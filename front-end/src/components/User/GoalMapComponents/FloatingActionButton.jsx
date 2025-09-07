import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Target } from 'lucide-react'

const FloatingActionButton = ({ goalId }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-6 right-6 md:hidden">
      <button
        onClick={() => navigate(`/user/goal/${goalId}`)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
      >
        <Target className="w-6 h-6" />
      </button>
    </div>
  )
}

export default FloatingActionButton