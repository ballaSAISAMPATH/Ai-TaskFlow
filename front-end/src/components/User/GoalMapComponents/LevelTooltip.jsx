import React from 'react'
import { CheckCircle2, Circle, Lock } from 'lucide-react'
import ReactDOM from 'react-dom'

const LevelTooltip = ({ 
  level, 
  levelIndex, 
  hoveredLevel, 
  getTaskCompletionCount, 
  isLevelUnlocked, 
  isTaskCompleted, 
  handleIndividualTaskToggle,
  position // 👈 pass {x, y} from parent for placement
}) => {
if (hoveredLevel !== levelIndex) return null

  const { type: taskType, index: groupIndex, tasks, label } = level
  const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
  const isUnlocked = isLevelUnlocked(levelIndex)

  const tooltip = (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        transform: "translateX(-50%)" // center horizontally
      }}
    >

      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-xs w-64 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 truncate">{label}</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium capitalize">
            {taskType}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-medium text-gray-800">{completed}/{total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        {isUnlocked && tasks && tasks.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tasks.slice(0, 3).map((taskContent, taskIndex) => {
              const isCompleted = isTaskCompleted(taskType, groupIndex, taskIndex)
              return (
                <div 
                  key={taskIndex}
                  className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleIndividualTaskToggle(taskType, groupIndex, taskIndex)}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 hover:text-green-500" />
                  )}
                  <p className={`text-xs leading-relaxed ${
                    isCompleted ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}>
                    {taskContent}
                  </p>
                </div>
              )
            })}
            {tasks.length > 3 && (
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                +{tasks.length - 3} more tasks
              </div>
            )}
          </div>
        )}

        {!isUnlocked && (
          <div className="text-center py-2">
            <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Complete previous level to unlock</p>
          </div>
        )}

        {/* Tooltip arrow */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="border-8 border-transparent border-t-white"></div>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(tooltip, document.body)
}

export default LevelTooltip
