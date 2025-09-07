import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, ArrowLeft } from 'lucide-react'

const NotFoundState = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-4">Adventure Not Found</h3>
        <p className="text-gray-600 mb-6">This goal adventure doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Go Back
        </button>
      </div>
    </div>
  )
}

export default NotFoundState