import React from 'react'

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-black font-medium">Loading your adventure...</p>
      </div>
    </div>
  )
}

export default LoadingState