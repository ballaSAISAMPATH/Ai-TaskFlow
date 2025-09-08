import React, { useEffect, useRef, useState } from 'react'
import { Users, Activity, Target } from 'lucide-react'
import { useSelector } from 'react-redux'

const Agent = ({ agentPosition, isMoving }) => {
  const agentRef = useRef(null)
  const [pulse, setPulse] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const {user} = useSelector((state)=>state.auth)

  useEffect(() => {
    if (agentRef.current && !isMoving) {
      setTimeout(() => {
        agentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
      }, 200)
    }
  }, [agentPosition, isMoving])

  // Subtle pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      ref={agentRef}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 ${
        isMoving ? 'scale-105' : 'scale-100'
      }`}
      style={{ 
        left: `${agentPosition.x}%`, 
        top: `${agentPosition.y}%` 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer detection ring */}
      <div className={`absolute inset-0 w-16 h-16 lg:w-18 lg:h-18 border border-slate-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ${
        isMoving ? 'animate-spin opacity-60' : 'opacity-30'
      } transition-all duration-500`}
      style={{ animationDuration: '8s' }}></div>

      {/* Scanning sweep */}
      {isMoving && (
        <div className="absolute inset-0 w-14 h-14 lg:w-16 lg:h-16 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-gradient-to-r from-slate-400 to-transparent origin-left rotate-0 animate-spin opacity-70" style={{ animationDuration: '3s' }}></div>
        </div>
      )}

      {/* Subtle corner markers */}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <div className="absolute w-2 h-2 border-l border-t border-slate-500" style={{ top: '-12px', left: '-12px' }}></div>
        <div className="absolute w-2 h-2 border-r border-t border-slate-500" style={{ top: '-12px', right: '-12px' }}></div>
        <div className="absolute w-2 h-2 border-l border-b border-slate-500" style={{ bottom: '-12px', left: '-12px' }}></div>
        <div className="absolute w-2 h-2 border-r border-b border-slate-500" style={{ bottom: '-12px', right: '-12px' }}></div>
      </div>

      {/* Main agent body - sleek and minimal */}
      <div className="relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-full border-2 border-slate-600 shadow-xl">
        {/* Inner ring */}
        <div className="absolute inset-1 border border-slate-500 rounded-full opacity-50"></div>
        
        {/* Core center */}
        <div className="absolute inset-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full">
          <div className={`w-full h-full rounded-full transition-all duration-1000 ${
            pulse === 1 ? 'shadow-lg shadow-slate-400/20' : ''
          }`}></div>
        </div>
        
        {/* Icon */}
        <div className="relative w-full h-full flex items-center justify-center rounded-full">
          {isMoving ? (
            <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300" />
          ) : (
            <Users className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
          )}
        </div>

        {/* Minimal movement indicator */}
        {isMoving && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-500 rounded-full animate-pulse">
            <div className="w-full h-full bg-slate-400 rounded-full animate-ping opacity-50"></div>
          </div>
        )}
      </div>

      {/* Data streams */}
      {isMoving && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40">
          <div className="absolute w-4 h-px bg-blue-400 animate-pulse" style={{ top: '-8px', left: '8px', animationDelay: '0s' }}></div>
          <div className="absolute w-3 h-px bg-blue-500 animate-pulse" style={{ top: '12px', left: '-6px', animationDelay: '0.5s' }}></div>
          <div className="absolute w-5 h-px bg-blue-400 animate-pulse" style={{ top: '6px', left: '10px', animationDelay: '1s' }}></div>
        </div>
      )}

      {/* Clean, minimal tooltip - shows on hover or when moving */}
      {(isHovered || isMoving) && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3">
          <div className="bg-blue-900 text-blue-200 px-3 py-1.5 rounded border border-blue-600 text-xs font-medium shadow-lg shadow-blue-900/30">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span>{user?.userName || 'USER'}</span>
              {isMoving && <Target className="w-3 h-3 text-blue-300" />}
            </div>
            
            {/* Simple arrow */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-900 border-l border-t border-blue-600 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agent