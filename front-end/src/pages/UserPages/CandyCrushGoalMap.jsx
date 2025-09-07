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
  
  const [taskStates, setTaskStates] = useState({
    daily: {},
    weekly: {},
    monthly: {}
  })

  // Path positions for the winding map
  const pathPositions = [
    { x: 50, y: 85 },   // Start bottom center
    { x: 30, y: 80 },   // Move left slightly
    { x: 15, y: 70 },   // Up and left
    { x: 25, y: 55 },   // Right and up
    { x: 45, y: 50 },   // Right
    { x: 65, y: 45 },   // More right
    { x: 80, y: 35 },   // Up right
    { x: 75, y: 20 },   // Up left
    { x: 55, y: 15 },   // Left
    { x: 35, y: 20 },   // Down left
    { x: 20, y: 30 },   // Down left more
    { x: 30, y: 45 },   // Right
    { x: 50, y: 40 },   // Right
    { x: 70, y: 35 },   // Right
    { x: 85, y: 50 },   // Down right
    { x: 80, y: 65 },   // Down
    { x: 65, y: 75 },   // Left
    { x: 45, y: 70 },   // Left
    { x: 25, y: 65 },   // Left
    { x: 40, y: 60 }    // Right slightly
  ]

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

      // Calculate current level index based on completion
      const completedLevels = newAllLevels.filter(level => level.status).length
      const newCurrentIndex = Math.min(completedLevels, newAllLevels.length - 1)
      setCurrentLevelIndex(newCurrentIndex)
      
      // Start initial animation from first node to current position
      if (newAllLevels.length > 0 && !initialAnimationComplete) {
        animateInitialTravel(newCurrentIndex)
      }
    }
  }, [selectedGoal])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const animateInitialTravel = (targetIndex) => {
    if (targetIndex === 0) {
      const position = pathPositions[0]
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
      
      const position = pathPositions[currentIndex % pathPositions.length]
      setAgentPosition(position)
      currentIndex++
      
      setTimeout(moveToNextNode, 300) // Faster animation for initial travel
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
      const newPosition = pathPositions[newLevelIndex % pathPositions.length]
      
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

  // Generate smooth road path between nodes, stopping at the last level
  const generateRoadPath = () => {
    if (pathPositions.length < 2 || allLevels.length === 0) return ""
    
    const maxNodes = Math.min(allLevels.length, pathPositions.length)
    const roadPositions = pathPositions.slice(0, maxNodes)
    
    let pathData = `M ${roadPositions[0].x} ${roadPositions[0].y}`
    
    for (let i = 1; i < roadPositions.length; i++) {
      const current = roadPositions[i]
      const prev = roadPositions[i - 1]
      
      // Create smooth curves between points
      if (i === 1) {
        pathData += ` Q ${prev.x + (current.x - prev.x) * 0.5} ${prev.y + (current.y - prev.y) * 0.5} ${current.x} ${current.y}`
      } else {
        const prevPrev = roadPositions[i - 2]
        const controlX = prev.x + (current.x - prevPrev.x) * 0.3
        const controlY = prev.y + (current.y - prevPrev.y) * 0.3
        pathData += ` S ${controlX} ${controlY} ${current.x} ${current.y}`
      }
    }
    
    return pathData
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
        <div className="absolute inset-0 w-8 h-8 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
        
        {/* Agent character - smaller */}
        <div className="relative w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg">
          <div className="w-full h-full flex items-center justify-center rounded-full">
            <Users className="w-4 h-4 text-white" />
          </div>
          
          {/* Agent movement trail */}
          {isMoving && (
            <div className="absolute inset-0 w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          )}
        </div>

        {/* Agent info tooltip - smaller */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
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
    const { type: taskType, index: groupIndex } = level
    const isUnlocked = isLevelUnlocked(levelIndex)
    const isCompleted = level.status
    const stars = getStars(taskType, groupIndex)
    const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
    
    const position = pathPositions[levelIndex % pathPositions.length]

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
        {/* Level Circle - small */}
        <div 
          className={`relative w-12 h-12 rounded-full border-2 shadow-lg transform transition-all duration-300 hover:scale-125 cursor-pointer ${
            isUnlocked 
              ? isCompleted
                ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-700 shadow-green-300'
                : 'bg-gradient-to-br from-white to-gray-50 border-green-500 shadow-green-200'
              : 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 shadow-gray-200'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center rounded-full">
            {!isUnlocked ? (
              <Lock className="w-5 h-5 text-gray-600" />
            ) : isCompleted ? (
              <Crown className="w-5 h-5 text-white drop-shadow-lg" />
            ) : (
              <span className="text-green-600 font-bold text-sm drop-shadow-sm">{levelIndex + 1}</span>
            )}
          </div>
          
          {/* Progress Ring */}
          {isUnlocked && total > 0 && (
            <svg className="absolute inset-0 w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
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
              <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1 left-0 w-1 h-1 bg-white rounded-full animate-bounce"></div>
            </div>
          )}
        </div>

        {/* Stars */}
        {isUnlocked && stars > 0 && (
          <div className="flex space-x-0.5 mt-1 justify-center">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-2.5 h-2.5 transition-all duration-300 ${
                  star <= stars ? 'text-yellow-500 fill-current animate-pulse' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover Tooltip */}
        {renderLevelTooltip(level, levelIndex)}
      </div>
    )
  }

  const renderTaskMap = () => {
    const roadPath = generateRoadPath()
    
    return (
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Trees */}
          <TreePine className="absolute top-[15%] left-[10%] w-8 h-8 text-green-400 opacity-40 animate-sway" />
          <TreePine className="absolute top-[35%] right-[15%] w-6 h-6 text-green-400 opacity-40 animate-sway-delayed" />
          <TreePine className="absolute bottom-[25%] left-[20%] w-7 h-7 text-green-400 opacity-40 animate-sway" />
          <TreePine className="absolute top-[65%] right-[25%] w-5 h-5 text-green-400 opacity-40 animate-sway-delayed" />
          
          {/* Mountains */}
          <Mountain className="absolute top-[5%] right-[30%] w-12 h-12 text-gray-300 opacity-30" />
          <Mountain className="absolute top-[40%] left-[5%] w-10 h-10 text-gray-300 opacity-30" />
          <Mountain className="absolute top-[10%] left-[70%] w-8 h-8 text-gray-400 opacity-20" />
          
          {/* Animated Clouds */}
          <div className="absolute top-[10%] left-[30%] w-16 h-8 bg-white opacity-20 rounded-full animate-float"></div>
          <div className="absolute top-[20%] right-[20%] w-12 h-6 bg-white opacity-20 rounded-full animate-float-delayed"></div>
          <div className="absolute top-[50%] left-[60%] w-14 h-7 bg-white opacity-20 rounded-full animate-float"></div>
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
          </defs>
          
          {/* Main road path */}
          <path 
            d={roadPath}
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#roadShadow)"
            className="animate-pulse"
          />
          
          {/* Road center line */}
          <path 
            d={roadPath}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2,3"
            className="animate-pulse"
          />
        </svg>
        
        {/* Map Container */}
        <div className="relative w-full h-full">
          {allLevels.map((level, mapIndex) => (
            renderMapLevel(level, mapIndex)
          ))}
          
          {/* Render the moving agent */}
          {renderAgent()}
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-black hover:bg-gray-100 rounded-xl px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="text-center flex-1 mx-4">
              <h1 className="text-xl sm:text-2xl font-bold text-black truncate mb-2">
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
              </div>
            </div>

            <div className="text-right">
              <div className="text-green-600 font-bold text-xl">
                {percentage}%
              </div>
              <div className="text-gray-600 text-sm">
                {completed}/{total} levels
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Adventure Progress</span>
              <span className="text-black text-sm font-medium">{percentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-700 relative overflow-hidden shadow-sm"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 0 && (
                  <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                )}
                {percentage > 15 && (
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
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
          <div className="text-center py-20">
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

      {/* Completion Celebration - Simplified */}
      {percentage === 100 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-white rounded-2xl p-10 text-center max-w-sm mx-4 shadow-2xl animate-bounce-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">🎉 Adventure Complete!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Congratulations! You've conquered all levels in your goal adventure!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Celebrate & Continue
            </button>
          </div>
        </div>
      )}
      
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
      `}</style>
    </div>
  )
}

export default CandyCrushGoalMap