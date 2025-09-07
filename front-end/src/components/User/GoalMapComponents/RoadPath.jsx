import React from 'react'

const RoadPath = ({ roadPath }) => {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 0.8 }} />
        </linearGradient>
        
        <filter id="roadShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
        </filter>

        <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 0.6 }} />
          <stop offset="50%" style={{ stopColor: '#fde68a', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 0.6 }} />
        </linearGradient>
      </defs>
      
      {/* Road glow effect */}
      <path 
        d={roadPath}
        fill="none"
        stroke="url(#roadGlow)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      {/* Main road path */}
      <path 
        d={roadPath}
        fill="none"
        stroke="url(#roadGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#roadShadow)"
        className="animate-pulse"
      />
      
      {/* Road center line */}
      <path 
        d={roadPath}
        fill="none"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3,4"
        className="animate-pulse"
      />
    </svg>
  )
}

export default RoadPath