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
  CalendarDays, 
  Timer,
  Star,
  Lock,
  Zap,
  Crown,
  Award,
  Play,
  X,
  MapPin,
  TreePine,
  Mountain
} from 'lucide-react'

const CandyCrushGoalMap = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { goalId } = useParams()
  const { user } = useSelector((state) => state.auth)
  const { selectedGoal, loading, error } = useSelector((state) => state.task)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(null)
  
  const [taskStates, setTaskStates] = useState({
    daily: {},
    weekly: {},
    monthly: {}
  })

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
    }
  }, [selectedGoal])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

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
    } catch (error) {
      toast.error('Failed to update task status')
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

  const isLevelUnlocked = (allLevels, currentIndex) => {
    if (currentIndex === 0) return true
    
    // Check if previous level is completed
    const prevLevel = allLevels[currentIndex - 1]
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

  const handleLevelClick = (level, allLevels, currentIndex) => {
    const isUnlocked = isLevelUnlocked(allLevels, currentIndex)
    if (!isUnlocked) {
      toast.error('Complete the previous level to unlock this one!')
      return
    }
    
    setSelectedLevel({...level, allLevels, currentIndex})
    setShowTaskModal(true)
  }

  const renderMapLevel = (level, allLevels, currentIndex, isLast = false) => {
    const { type: taskType, index: groupIndex } = level
    const isUnlocked = isLevelUnlocked(allLevels, currentIndex)
    const isCompleted = level.status
    const stars = getStars(taskType, groupIndex)
    const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
    
    // Map-like positioning with winding path
    const pathPositions = [
      { x: 50, y: 85 },   // Start bottom center
      { x: 25, y: 75 },   // Move left
      { x: 15, y: 60 },   // Up and left
      { x: 35, y: 50 },   // Right
      { x: 60, y: 45 },   // More right
      { x: 80, y: 35 },   // Up right
      { x: 70, y: 20 },   // Up left
      { x: 45, y: 15 },   // Left
      { x: 20, y: 25 },   // Down left
      { x: 30, y: 40 },   // Right
      { x: 55, y: 30 },   // Up right
      { x: 75, y: 50 },   // Down right
      { x: 85, y: 65 },   // Down right more
      { x: 65, y: 75 },   // Left
      { x: 40, y: 70 }    // More left
    ]
    
    const position = pathPositions[currentIndex % pathPositions.length]

    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2" 
        key={`${taskType}-${groupIndex}`}
        style={{ 
          left: `${position.x}%`, 
          top: `${position.y}%` 
        }}
      >
        {/* Path Line to next level */}
        {!isLast && currentIndex < pathPositions.length - 1 && (
          <svg 
            className="absolute top-1/2 left-1/2 -z-10" 
            width="120" 
            height="120" 
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <defs>
              <path 
                id={`path-${currentIndex}`}
                d={`M 0 0 Q ${(pathPositions[(currentIndex + 1) % pathPositions.length].x - position.x) * 1.5} ${(pathPositions[(currentIndex + 1) % pathPositions.length].y - position.y) * 1.5} ${(pathPositions[(currentIndex + 1) % pathPositions.length].x - position.x) * 2} ${(pathPositions[(currentIndex + 1) % pathPositions.length].y - position.y) * 2}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="12,8"
                strokeLinecap="round"
              />
            </defs>
            <use href={`#path-${currentIndex}`} />
          </svg>
        )}
        
        {/* Level Circle */}
        <div 
          className={`relative w-20 h-20 rounded-full border-4 shadow-xl transform transition-all duration-300 hover:scale-110 cursor-pointer ${
            isUnlocked 
              ? isCompleted
                ? 'bg-green-500 border-green-600 shadow-green-300'
                : 'bg-white border-green-500 shadow-green-200'
              : 'bg-gray-300 border-gray-400 shadow-gray-200'
          }`}
          onClick={() => handleLevelClick(level, allLevels, currentIndex)}
        >
          <div className="w-full h-full flex items-center justify-center rounded-full">
            {!isUnlocked ? (
              <Lock className="w-8 h-8 text-gray-600" />
            ) : isCompleted ? (
              <Crown className="w-8 h-8 text-white" />
            ) : (
              <span className="text-green-600 font-bold text-xl">{currentIndex + 1}</span>
            )}
          </div>
          
          {/* Progress Ring */}
          {isUnlocked && total > 0 && (
            <svg className="absolute inset-0 w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="rgba(16, 185, 129, 0.2)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(completed / total) * 226} 226`}
                className="transition-all duration-700"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Stars */}
        {isUnlocked && stars > 0 && (
          <div className="flex space-x-1 mt-2 justify-center">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= stars ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Level Info */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3">
          <div className="bg-white rounded-lg px-3 py-1 shadow-md border border-gray-200">
            <div className="text-center">
              <div className="text-xs font-bold text-black truncate max-w-16">
                {level.label}
              </div>
              <div className="text-xs text-gray-600">
                {completed}/{total}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTaskModal = () => {
    if (!showTaskModal || !selectedLevel) return null

    const { type: taskType, index: groupIndex, tasks, label } = selectedLevel
    const { completed, total } = getTaskCompletionCount(taskType, groupIndex)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className="bg-green-500 p-6 text-white relative">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">{label}</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90 capitalize">{taskType} Tasks</span>
              <span className="text-sm font-medium">{completed}/{total} Complete</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {tasks && tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((taskContent, taskIndex) => {
                  const isCompleted = isTaskCompleted(taskType, groupIndex, taskIndex)
                  
                  return (
                    <div 
                      key={taskIndex}
                      className={`border rounded-xl p-4 transition-all duration-200 ${
                        isCompleted 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleIndividualTaskToggle(taskType, groupIndex, taskIndex)}
                          className="mt-1 flex-shrink-0 transition-transform duration-200 hover:scale-110"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${
                            isCompleted 
                              ? 'line-through text-gray-500' 
                              : 'text-black'
                          }`}>
                            {taskContent}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tasks in this group</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-100 p-6">
            <button
              onClick={() => setShowTaskModal(false)}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderTaskMap = () => {
    const allLevels = []
    
    // Combine all task types into a single map
    const dailyTasks = selectedGoal?.dailyTasks || []
    const weeklyTasks = selectedGoal?.weeklyTasks || []
    const monthlyTasks = selectedGoal?.monthlyTasks || []

    // Add daily tasks
    dailyTasks.forEach((group, index) => {
      allLevels.push({ ...group, type: 'daily', index })
    })

    // Add weekly tasks
    weeklyTasks.forEach((group, index) => {
      allLevels.push({ ...group, type: 'weekly', index })
    })

    // Add monthly tasks
    monthlyTasks.forEach((group, index) => {
      allLevels.push({ ...group, type: 'monthly', index })
    })

    return (
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Elements - Map decorations */}
        <div className="absolute inset-0">
          {/* Trees */}
          <TreePine className="absolute top-[15%] left-[10%] w-8 h-8 text-green-400 opacity-60" />
          <TreePine className="absolute top-[35%] right-[15%] w-6 h-6 text-green-400 opacity-60" />
          <TreePine className="absolute bottom-[25%] left-[20%] w-7 h-7 text-green-400 opacity-60" />
          <TreePine className="absolute top-[65%] right-[25%] w-5 h-5 text-green-400 opacity-60" />
          
          {/* Mountains */}
          <Mountain className="absolute top-[5%] right-[30%] w-12 h-12 text-gray-300 opacity-40" />
          <Mountain className="absolute top-[40%] left-[5%] w-10 h-10 text-gray-300 opacity-40" />
          
          {/* Clouds */}
          <div className="absolute top-[10%] left-[30%] w-16 h-8 bg-white opacity-30 rounded-full"></div>
          <div className="absolute top-[20%] right-[20%] w-12 h-6 bg-white opacity-30 rounded-full"></div>
          <div className="absolute top-[50%] left-[60%] w-14 h-7 bg-white opacity-30 rounded-full"></div>
        </div>
        
        {/* Map Container */}
        <div className="relative w-full h-full">
          {allLevels.map((level, mapIndex) => (
            renderMapLevel(level, allLevels, mapIndex, mapIndex === allLevels.length - 1)
          ))}
        </div>
      </div>
    )
  }

  const getOverallProgress = () => {
    const allGroups = [
      ...(selectedGoal?.dailyTasks || []),
      ...(selectedGoal?.weeklyTasks || []),
      ...(selectedGoal?.monthlyTasks || [])
    ]
    
    const completed = allGroups.filter(group => group.status).length
    const total = allGroups.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percentage }
  }

  if (loading.getGoalById) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading your adventure...</p>
        </div>
      </div>
    )
  }

  if (!selectedGoal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
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

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Adventure Progress</span>
              <span className="text-black text-sm font-medium">{percentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 15 && (
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <Zap className="w-4 h-4 text-white" />
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

      {/* Task Detail Modal */}
      {renderTaskModal()}

      {/* Completion Celebration */}
      {percentage === 100 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-white rounded-2xl p-10 text-center max-w-sm mx-4 shadow-2xl">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">🎉 Adventure Complete!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Congratulations! You've conquered all levels in your goal adventure!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="w-full bg-green-500 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                View Dashboard
              </button>
              <button
                onClick={() => setShowTaskModal(false)}
                className="w-full bg-gray-100 text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandyCrushGoalMap