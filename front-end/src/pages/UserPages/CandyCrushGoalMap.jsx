import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getGoalById, updateDailyTaskStatus, updateWeeklyTaskStatus, updateMonthlyTaskStatus } from '@/store/task'
import { toast } from 'sonner'
import MapHeader from '@/components/User/GoalMapComponents/MapHeader'
import LoadingState from '@/components/User/GoalMapComponents/LoadingState'
import NotFoundState from '@/components/User/GoalMapComponents/NotFoundState'
import EmptyState from '@/components/User/GoalMapComponents/EmptyState'
import TaskMap from '@/components/User/GoalMapComponents/TaskMap'
import CompletionCelebration from '@/components/User/GoalMapComponents/CompletionCelebration'
import MobileLevelInfo from '@/components/User/GoalMapComponents/MobileLevelInfo'
import FloatingActionButton from '@/components/User/GoalMapComponents/FloatingActionButton'
import Styles from '@/components/User/GoalMapComponents/Styles'
const CandyCrushGoalMap = () => {
  const dispatch = useDispatch()
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

  const getOverallProgress = () => {
    const completed = allLevels.filter(level => level.status).length
    const total = allLevels.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percentage }
  }

  if (loading.getGoalById) {
    return <LoadingState />
  }

  if (!selectedGoal) {
    return <NotFoundState />
  }

  const { completed, total, percentage } = getOverallProgress()
  const backgroundElements = generateBackgroundElements(allLevels.length)
  const roadPath = generateSmoothRoadPath(pathPositions)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white">
      {/* Header */}
      <MapHeader 
        selectedGoal={selectedGoal}
        completed={completed}
        total={total}
        percentage={percentage}
      />

      {/* Map Content */}
      <div className="relative">
        {total === 0 ? (
          <EmptyState goalId={goalId} />
        ) : (
          <TaskMap
            backgroundElements={backgroundElements}
            roadPath={roadPath}
            allLevels={allLevels}
            pathPositions={pathPositions}
            isLevelUnlocked={isLevelUnlocked}
            getStars={getStars}
            getTaskCompletionCount={getTaskCompletionCount}
            setHoveredLevel={setHoveredLevel}
            hoveredLevel={hoveredLevel}
            isTaskCompleted={isTaskCompleted}
            handleIndividualTaskToggle={handleIndividualTaskToggle}
            agentPosition={agentPosition}
            isMoving={isMoving}
          />
        )}
      </div>

      {/* Level Info Panel - Mobile Bottom Sheet Style */}
      <MobileLevelInfo
        hoveredLevel={hoveredLevel}
        allLevels={allLevels}
        setHoveredLevel={setHoveredLevel}
      />

      {/* Completion Celebration */}
      <CompletionCelebration
        percentage={percentage}
        total={total}
        onCelebrate={() => window.location.reload()}
      />

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton goalId={goalId} />

      {/* Styles */}
      <Styles />
    </div>
  )
}

export default CandyCrushGoalMap