import React from 'react'
import { Award } from 'lucide-react'

const CompletionCelebration = ({ percentage, total, onCelebrate }) => {
  if (percentage !== 100) return null

  return (
<div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-10 text-center max-w-sm mx-4 shadow-2xl animate-bounce-in">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Award className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-black mb-4">🎉 Adventure Complete!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Congratulations! You've conquered all {total} levels in your goal adventure!
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-green-600 text-xl">{total}</div>
              <div>Levels</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600 text-xl">100%</div>
              <div>Complete</div>
            </div>
            <div className="text-center">
                <div>Perfect</div>
            </div>
          </div>
          <button
            onClick={onCelebrate}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Celebrate & Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompletionCelebration