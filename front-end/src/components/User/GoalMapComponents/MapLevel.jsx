import { Lock, Crown, Star } from 'lucide-react'
import LevelTooltip from './LevelTooltip'
import ReactDOM from 'react-dom'
import React, { useRef } from 'react'

const MapLevel = ({ 
  level, 
  levelIndex, 
  pathPositions, 
  isLevelUnlocked, 
  getStars, 
  getTaskCompletionCount, 
  setHoveredLevel, 
  hoveredLevel,
  isTaskCompleted,
  handleIndividualTaskToggle
}) => {
  if (!pathPositions[levelIndex]) return null
  const levelRef = useRef(null)

  const { type: taskType, index: groupIndex } = level
  const isUnlocked = isLevelUnlocked(levelIndex)
  const isCompleted = level.status
  const stars = getStars(taskType, groupIndex)
  const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
  
  const position = pathPositions[levelIndex]

  return (
    <div 
     ref={levelRef} 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30" 
      key={`${taskType}-${groupIndex}-${levelIndex}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%` 
      }}
      onMouseEnter={() => setHoveredLevel(levelIndex)}
      onMouseLeave={() => setHoveredLevel(null)}
    >
      {/* Level Circle - responsive size */}
      <div 
        className={`relative w-14 h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full border-3 shadow-lg transform transition-all duration-300 hover:scale-125 cursor-pointer ${
          isUnlocked 
            ? isCompleted
              ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-700 shadow-green-300'
              : 'bg-gradient-to-br from-white to-gray-50 border-green-500 shadow-green-200'
            : 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 shadow-gray-200'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center rounded-full">
          {!isUnlocked ? (
            <Lock className="w-6 h-6 lg:w-7 lg:h-7 text-gray-600" />
          ) : isCompleted ? (
            <Crown className="w-6 h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
          ) : (
            <span className="text-green-600 font-bold text-base lg:text-lg drop-shadow-sm">{levelIndex + 1}</span>
          )}
        </div>
        
        {/* Progress Ring */}
        {isUnlocked && total > 0 && (
          <svg className="absolute inset-0 w-14 h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20 transform -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${(completed / total) * 126} 126`}
              className="transition-all duration-700"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Completion Sparkle Effect */}
        {isCompleted && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1 left-0 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Stars */}
      {isUnlocked && stars > 0 && (
        <div className="flex space-x-1 mt-2 justify-center">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 lg:w-4 lg:h-4 transition-all duration-300 ${
                star <= stars ? 'text-yellow-500 fill-current animate-pulse' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Level number badge for completed levels */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
          {levelIndex + 1}
        </div>
      )}

      {/* Hover Tooltip */}
        <LevelTooltip
          level={level}
          levelIndex={levelIndex}
          hoveredLevel={hoveredLevel}
          getTaskCompletionCount={getTaskCompletionCount}
          isLevelUnlocked={isLevelUnlocked}
          isTaskCompleted={isTaskCompleted}
          handleIndividualTaskToggle={handleIndividualTaskToggle}
          position={
            levelRef.current
              ? {
                  x:
                    levelRef.current.getBoundingClientRect().left +
                    levelRef.current.offsetWidth / 2 +
                    window.scrollX, // 👈 account for horizontal scroll
                  y:
                    levelRef.current.getBoundingClientRect().top +
                    window.scrollY - 350 // 👈 place 12px above circle
                }
              : null
          }
        />

    </div>
  )
}

export default MapLevel