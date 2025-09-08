import React, { useEffect, useRef } from 'react'
import { Users } from 'lucide-react'

const Agent = ({ agentPosition, isMoving }) => {
  const agentRef = useRef(null)

  useEffect(() => {
    if (agentRef.current && !isMoving) {
      // Small delay to ensure position is updated first
      setTimeout(() => {
        agentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
      }, 200) // Delay allows movement animation to complete
    }
  }, [agentPosition, isMoving])

  return (
    <div 
      ref={agentRef}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-800 ${
        isMoving ? 'scale-110' : ''
      }`}
      style={{ 
        left: `${agentPosition.x}%`, 
        top: `${agentPosition.y}%` 
      }}
    >
      {/* Agent glow effect */}
      <div className="absolute inset-0 w-10 h-10 lg:w-12 lg:h-12 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
      
      {/* Agent character */}
      <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-3 border-white shadow-lg">
        <div className="w-full h-full flex items-center justify-center rounded-full">
          <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        
        {/* Agent movement trail */}
        {isMoving && (
          <div className="absolute inset-0 w-10 h-10 lg:w-12 lg:h-12 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        )}
      </div>

      {/* Agent info tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
        <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold shadow-lg">
          You
        </div>
      </div>
    </div>
  )
}

export default Agent