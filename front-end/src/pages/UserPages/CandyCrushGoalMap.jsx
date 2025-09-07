import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
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

// Custom hooks
import { useGoalData } from '@/utilities/hooks/GoalMap/useGoalData'
import { usePathGeneration } from '@/utilities/hooks/GoalMap/usePathGeneration'
import { useTaskStates } from '@/utilities/hooks/GoalMap/useTaskStates'
import { useAgentMovement } from '@/utilities/hooks/GoalMap/useAgentMovement'
import { useTaskActions } from '@/utilities/hooks/GoalMap/useTaskActions'
// Utilities
import { generateBackgroundElements,generateSmoothRoadPath } from '@/utilities/GoalMapUtils/pathUtils'
import { getStars,isLevelUnlocked, getOverallProgress } from '@/utilities/GoalMapUtils/gameUtils'

const CandyCrushGoalMap = () => {
  const { goalId } = useParams()
  const { user } = useSelector((state) => state.auth)
  const [hoveredLevel, setHoveredLevel] = useState(null)
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false)

  // Custom hooks
  const { selectedGoal, loading, error, allLevels } = useGoalData(goalId, user)
  const { pathPositions } = usePathGeneration(allLevels.length)
  const { taskStates, setTaskStates, getTaskCompletionCount, isTaskCompleted } = useTaskStates(selectedGoal)
  const { agentPosition, isMoving, moveAgentToNextLevel } = useAgentMovement(
    allLevels, 
    pathPositions, 
    initialAnimationComplete
  )
  const { handleGroupStatusUpdate } = useTaskActions(goalId, user, moveAgentToNextLevel)

  // Set initial animation complete after first render
  useEffect(() => {
    if (allLevels.length > 0 && pathPositions.length > 0) {
      setTimeout(() => setInitialAnimationComplete(true), 1000)
    }
  }, [allLevels, pathPositions])

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

  if (loading.getGoalById) {
    return <LoadingState />
  }

  if (!selectedGoal) {
    return <NotFoundState />
  }

  const { completed, total, percentage } = getOverallProgress(allLevels)
  const backgroundElements = generateBackgroundElements(allLevels.length, pathPositions)
  const roadPath = generateSmoothRoadPath(pathPositions)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white">
      <MapHeader 
        selectedGoal={selectedGoal}
        completed={completed}
        total={total}
        percentage={percentage}
      />

      <div className="relative">
        {total === 0 ? (
          <EmptyState goalId={goalId} />
        ) : (
          <TaskMap
            backgroundElements={backgroundElements}
            roadPath={roadPath}
            allLevels={allLevels}
            pathPositions={pathPositions}
            isLevelUnlocked={(levelIndex) => isLevelUnlocked(levelIndex, allLevels)}
            getStars={(taskType, groupIndex) => getStars(taskStates, taskType, groupIndex)}
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

      <MobileLevelInfo
        hoveredLevel={hoveredLevel}
        allLevels={allLevels}
        setHoveredLevel={setHoveredLevel}
      />

      <CompletionCelebration
        percentage={percentage}
        total={total}
        onCelebrate={() => window.location.reload()}
      />

      <FloatingActionButton goalId={goalId} />

      <Styles />
    </div>
  )
}

export default CandyCrushGoalMap