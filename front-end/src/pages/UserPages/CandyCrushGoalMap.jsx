import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getGoalById, updateDailyTaskStatus, updateWeeklyTaskStatus, updateMonthlyTaskStatus } from '@/store/task'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2, 
  Circle, 
  Star,
  Lock,
  Zap,
  Crown,
  Award,
  Play,
  TreePine,
  Mountain,
  Users
} from 'lucide-react'

const CandyCrushGoalMap = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { goalId } = useParams()
  const { user } = useSelector((state) => state.auth)
  const { selectedGoal, loading, error } = useSelector((state) => state.task)
  const [agentPosition, setAgentPosition] = useState({ x: 50, y: 85 })
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [allLevels, setAllLevels] = useState([])
  const [hoveredLevel, setHoveredLevel] = useState(null)
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false)
  const [pathPositions, setPathPositions] = useState([])
  
  const [taskStates, setTaskStates] = useState({
    daily: {},
    weekly: {},
    monthly: {}
  })

  // Dynamic path generation function
  const generateDynamicPath = (levelCount) => {
    if (levelCount === 0) return []
    if (levelCount === 1) return [{ x: 50, y: 85 }]

    const positions = []
    const mapWidth = 100
    const mapHeight = 100
    const margin = 15 // Margin from edges
    const usableWidth = mapWidth - (margin * 2)
    const usableHeight = mapHeight - (margin * 2)
    
    // Calculate optimal spacing based on level count
    const minVerticalSpacing = 8
    const optimalLevelsPerRow = Math.max(3, Math.min(6, Math.ceil(Math.sqrt(levelCount))))
    const rows = Math.ceil(levelCount / optimalLevelsPerRow)
    const verticalSpacing = Math.max(minVerticalSpacing, usableHeight / (rows + 1))
    
    let currentLevel = 0
    let direction = 1 // 1 for right, -1 for left (zigzag pattern)
    
    for (let row = 0; row < rows && currentLevel < levelCount; row++) {
      const levelsInThisRow = Math.min(optimalLevelsPerRow, levelCount - currentLevel)
      const horizontalSpacing = usableWidth / (levelsInThisRow + 1)
      
      // Calculate y position for this row (starting from bottom)
      const y = mapHeight - margin - (row * verticalSpacing)
      
      for (let col = 0; col < levelsInThisRow && currentLevel < levelCount; col++) {
        let x
        
        if (direction === 1) {
          // Left to right
          x = margin + ((col + 1) * horizontalSpacing)
        } else {
          // Right to left
          x = margin + ((levelsInThisRow - col) * horizontalSpacing)
        }
        
        // Add some curvature variation for more organic feel
        const curvatureOffset = Math.sin((currentLevel * Math.PI) / 6) * 3
        x += curvatureOffset
        
        // Ensure we stay within bounds
        x = Math.max(margin, Math.min(mapWidth - margin, x))
        
        positions.push({ x, y })
        currentLevel++
      }
      
      // Switch direction for next row (zigzag pattern)
      direction *= -1
    }
    
    return positions
  }

  // Enhanced smooth path generation with better curves
  const generateSmoothRoadPath = (positions) => {
    if (positions.length < 2) return ""
    if (positions.length === 2) {
      return `M ${positions[0].x} ${positions[0].y} L ${positions[1].x} ${positions[1].y}`
    }
    
    let pathData = `M ${positions[0].x} ${positions[0].y}`
    
    for (let i = 1; i < positions.length; i++) {
      const current = positions[i]
      const prev = positions[i - 1]
      const next = positions[i + 1]
      
      if (i === 1) {
        // First curve - create smooth entry
        const controlX = prev.x + (current.x - prev.x) * 0.6
        const controlY = prev.y + (current.y - prev.y) * 0.4
        pathData += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`
      } else {
        // Use smooth curve based on previous, current, and next points
        const tension = 0.3
        let controlX, controlY
        
        if (next) {
          // Calculate control point based on the direction change
          const prevDirection = { x: current.x - prev.x, y: current.y - prev.y }
          const nextDirection = { x: next.x - current.x, y: next.y - current.y }
          
          controlX = current.x - (prevDirection.x * tension) + (nextDirection.x * tension * 0.5)
          controlY = current.y - (prevDirection.y * tension) + (nextDirection.y * tension * 0.5)
        } else {
          // Last point - smooth ending
          controlX = prev.x + (current.x - prev.x) * 0.7
          controlY = prev.y + (current.y - prev.y) * 0.7
        }
        
        pathData += ` S ${controlX} ${controlY} ${current.x} ${current.y}`
      }
    }
    
    return pathData
  }

  // Generate background decorations based on map size
  const generateBackgroundElements = (levelCount) => {
    const elementCount = Math.min(12, Math.max(6, Math.floor(levelCount / 3)))
    const elements = []
    
    for (let i = 0; i < elementCount; i++) {
      const element = {
        id: i,
        type: Math.random() < 0.6 ? 'tree' : 'mountain',
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 20 + Math.random() * 40,
        opacity: 0.2 + Math.random() * 0.2,
        animationDelay: Math.random() * 2
      }
      
      // Ensure elements don't overlap with path (rough check)
      const tooCloseToPath = pathPositions.some(pos => 
        Math.abs(pos.x - element.x) < 10 && Math.abs(pos.y - element.y) < 10
      )
      
      if (!tooCloseToPath) {
        elements.push(element)
      }
    }
    
    return elements
  }

  useEffect(() => {
    if (user && goalId) {
      dispatch(getGoalById({ goalId, user }))
    }
  }, [dispatch, user, goalId])

  useEffect(() => {
    if (selectedGoal) {
      const initializeTaskStates = (taskGroups, taskType) => {
        const states = {}
        taskGroups?.forEach((group, groupIndex) => {
          states[groupIndex] = {}
          group.tasks?.forEach((_, taskIndex) => {
            states[groupIndex][taskIndex] = group.status || false
          })
        })
        return states
      }

      setTaskStates({
        daily: initializeTaskStates(selectedGoal.dailyTasks, 'daily'),
        weekly: initializeTaskStates(selectedGoal.weeklyTasks, 'weekly'),
        monthly: initializeTaskStates(selectedGoal.monthlyTasks, 'monthly')
      })

      // Build all levels array
      const newAllLevels = []
      
      // Add daily tasks
      selectedGoal.dailyTasks?.forEach((group, index) => {
        newAllLevels.push({ ...group, type: 'daily', index })
      })

      // Add weekly tasks
      selectedGoal.weeklyTasks?.forEach((group, index) => {
        newAllLevels.push({ ...group, type: 'weekly', index })
      })

      // Add monthly tasks
      selectedGoal.monthlyTasks?.forEach((group, index) => {
        newAllLevels.push({ ...group, type: 'monthly', index })
      })

      setAllLevels(newAllLevels)

      // Generate dynamic path positions based on level count
      const dynamicPositions = generateDynamicPath(newAllLevels.length)
      setPathPositions(dynamicPositions)

      // Calculate current level index based on completion
      const completedLevels = newAllLevels.filter(level => level.status).length
      const newCurrentIndex = Math.min(completedLevels, newAllLevels.length - 1)
      setCurrentLevelIndex(newCurrentIndex)
      
      // Start initial animation from first node to current position
      if (newAllLevels.length > 0 && !initialAnimationComplete && dynamicPositions.length > 0) {
        animateInitialTravel(newCurrentIndex, dynamicPositions)
      }
    }
  }, [selectedGoal])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const animateInitialTravel = (targetIndex, positions) => {
    if (targetIndex === 0 || positions.length === 0) {
      const position = positions[0] || { x: 50, y: 85 }
      setAgentPosition(position)
      setInitialAnimationComplete(true)
      return
    }

    setIsMoving(true)
    let currentIndex = 0
    
    const moveToNextNode = () => {
      if (currentIndex >= targetIndex) {
        setIsMoving(false)
        setInitialAnimationComplete(true)
        return
      }
      
      const position = positions[currentIndex] || { x: 50, y: 85 }
      setAgentPosition(position)
      currentIndex++
      
      setTimeout(moveToNextNode, 300)
    }
    
    moveToNextNode()
  }

  const handleIndividualTaskToggle = (taskType, groupIndex, taskIndex) => {
    setTaskStates(prevStates => {
      const newStates = { ...prevStates }
      const currentTaskState = newStates[taskType][groupIndex][taskIndex]
      newStates[taskType][groupIndex][taskIndex] = !currentTaskState

      const groupTasks = newStates[taskType][groupIndex]
      const allTasksCompleted = Object.values(groupTasks).every(status => status === true)
      const anyTaskCompleted = Object.values(groupTasks).some(status => status === true)

      if (allTasksCompleted && !currentTaskState) {
        handleGroupStatusUpdate(taskType, groupIndex, true)
      } else if (!anyTaskCompleted && currentTaskState) {
        handleGroupStatusUpdate(taskType, groupIndex, false)
      }

      return newStates
    })
  }

  const handleGroupStatusUpdate = async (taskType, groupIndex, status) => {
    try {
      if (taskType === 'daily') {
        await dispatch(updateDailyTaskStatus({ 
          goalId, 
          taskIndex: groupIndex,
          status, 
          user 
        })).unwrap()
      } else if (taskType === 'weekly') {
        await dispatch(updateWeeklyTaskStatus({ 
          goalId, 
          taskIndex: groupIndex,
          status, 
          user 
        })).unwrap()
      } else if (taskType === 'monthly') {
        await dispatch(updateMonthlyTaskStatus({ 
          goalId, 
          taskIndex: groupIndex,
          status, 
          user 
        })).unwrap()
      }

      await dispatch(getGoalById({ goalId, user }))
      toast.success(`Task group ${status ? 'completed' : 'marked as incomplete'}!`)
      
      // Move agent if task was completed
      if (status) {
        moveAgentToNextLevel()
      }
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const moveAgentToNextLevel = () => {
    const completedLevels = allLevels.filter(level => level.status).length
    const newLevelIndex = Math.min(completedLevels, allLevels.length - 1)
    
    if (newLevelIndex !== currentLevelIndex && newLevelIndex < pathPositions.length) {
      setIsMoving(true)
      const newPosition = pathPositions[newLevelIndex]
      
      // Animate movement
      setTimeout(() => {
        setAgentPosition(newPosition)
        setCurrentLevelIndex(newLevelIndex)
        setIsMoving(false)
      }, 800)
    }
  }

  const getTaskCompletionCount = (taskType, groupIndex) => {
    if (!taskStates[taskType][groupIndex]) return { completed: 0, total: 0 }

    const groupTasks = taskStates[taskType][groupIndex]
    const completed = Object.values(groupTasks).filter(status => status === true).length
    const total = Object.keys(groupTasks).length

    return { completed, total }
  }

  const isTaskCompleted = (taskType, groupIndex, taskIndex) => {
    return taskStates[taskType][groupIndex]?.[taskIndex] || false
  }

  const isLevelUnlocked = (levelIndex) => {
    if (levelIndex === 0) return true
    
    // Check if previous level is completed
    const prevLevel = allLevels[levelIndex - 1]
    return prevLevel?.status || false
  }

  const getStars = (taskType, groupIndex) => {
    const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
    if (total === 0) return 0
    
    const percentage = (completed / total) * 100
    if (percentage === 100) return 3
    if (percentage >= 66) return 2
    if (percentage >= 33) return 1
    return 0
  }

  const renderAgent = () => {
    return (
      <div 
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

  const renderLevelTooltip = (level, levelIndex) => {
    if (hoveredLevel !== levelIndex) return null

    const { type: taskType, index: groupIndex, tasks, label } = level
    const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
    const isUnlocked = isLevelUnlocked(levelIndex)

    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-xs w-64">
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
                      isCompleted 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-700'
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
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-8 border-transparent border-t-white"></div>
          </div>
        </div>
      </div>
    )
  }

  const renderMapLevel = (level, levelIndex) => {
    if (!pathPositions[levelIndex]) return null
    
    const { type: taskType, index: groupIndex } = level
    const isUnlocked = isLevelUnlocked(levelIndex)
    const isCompleted = level.status
    const stars = getStars(taskType, groupIndex)
    const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
    
    const position = pathPositions[levelIndex]

    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20" 
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
        {renderLevelTooltip(level, levelIndex)}
      </div>
    )
  }

  const renderTaskMap = () => {
    const backgroundElements = generateBackgroundElements(allLevels.length)
    const roadPath = generateSmoothRoadPath(pathPositions)
    
    return (
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Background Elements - Dynamic */}
        <div className="absolute inset-0">
          {backgroundElements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.animationDelay}s`
              }}
            >
              {element.type === 'tree' ? (
                <TreePine 
                  className="text-green-400 animate-sway" 
                  style={{ 
                    width: `${element.size}px`, 
                    height: `${element.size}px`,
                    opacity: element.opacity 
                  }}
                />
              ) : (
                <Mountain 
                  className="text-gray-300" 
                  style={{ 
                    width: `${element.size}px`, 
                    height: `${element.size}px`,
                    opacity: element.opacity 
                  }}
                />
              )}
            </div>
          ))}
          
          {/* Animated Clouds */}
          <div className="absolute top-[10%] left-[30%] w-16 h-8 bg-white opacity-20 rounded-full animate-float"></div>
          <div className="absolute top-[20%] right-[20%] w-12 h-6 bg-white opacity-20 rounded-full animate-float-delayed"></div>
          <div className="absolute top-[50%] left-[60%] w-14 h-7 bg-white opacity-20 rounded-full animate-float"></div>
          <div className="absolute bottom-[30%] right-[40%] w-10 h-5 bg-white opacity-15 rounded-full animate-float-delayed"></div>
        </div>
        
        {/* Road Path SVG */}
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
        
        {/* Map Container */}
        <div className="relative w-full h-full min-h-screen">
          {allLevels.map((level, mapIndex) => (
            renderMapLevel(level, mapIndex)
          ))}
          
          {/* Render the moving agent */}
          {pathPositions.length > 0 && renderAgent()}
        </div>
      </div>
    )
  }

  const getOverallProgress = () => {
    const completed = allLevels.filter(level => level.status).length
    const total = allLevels.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percentage }
  }

  if (loading.getGoalById) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading your adventure...</p>
        </div>
      </div>
    )
  }

  if (!selectedGoal) {
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

  const { completed, total, percentage } = getOverallProgress()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white">
      {/* Header */}
      <div className="bg-white shadow-md border-b-2 border-green-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-black hover:bg-gray-100 rounded-xl px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="text-center flex-1 mx-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black truncate mb-2">
                {selectedGoal.goalTitle}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{selectedGoal.totalDays} days</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{selectedGoal.duration}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{total} levels</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-green-600 font-bold text-xl lg:text-2xl">
                {percentage}%
              </div>
              <div className="text-gray-600 text-sm">
                {completed}/{total} complete
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Adventure Progress</span>
              <span className="text-black text-sm font-medium">{percentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-5 rounded-full transition-all duration-700 relative overflow-hidden shadow-sm"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 0 && (
                  <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                )}
                {percentage > 15 && (
                  <div className="absolute inset-0 flex items-center justify-end pr-4">
                    <Zap className="w-4 h-4 text-white animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="relative">
        {total === 0 ? (
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
        ) : (
          renderTaskMap()
        )}
      </div>

      {/* Level Info Panel - Mobile Bottom Sheet Style */}
      {hoveredLevel !== null && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
          {allLevels[hoveredLevel] && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">{allLevels[hoveredLevel].label}</h4>
                <button 
                  onClick={() => setHoveredLevel(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-gray-600">
                Level {hoveredLevel + 1} • {allLevels[hoveredLevel].type}
              </div>
            </>
          )}
        </div>
      )}

      {/* Completion Celebration */}
      {percentage === 100 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
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
                  <div className="font-bold text-purple-600 text-xl">⭐⭐⭐</div>
                  <div>Perfect</div>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Celebrate & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => navigate(`/user/goal/${goalId}`)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
        >
          <Target className="w-6 h-6" />
        </button>
      </div>
      
      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        
        @keyframes sway-delayed {
          0%, 100% { transform: rotate(2deg); }
          50% { transform: rotate(-2deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.4), 0 0 10px rgba(34, 197, 94, 0.2), 0 0 15px rgba(34, 197, 94, 0.1);
          }
          50% { 
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2);
          }
        }
        
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        
        .animate-sway-delayed {
          animation: sway-delayed 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .animate-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Custom scrollbar for tooltips */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}

export default CandyCrushGoalMap