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
import { useRef } from 'react'
// Custom hooks
import { useGoalData } from '@/utilities/hooks/GoalMap/useGoalData'
import { usePathGeneration } from '@/utilities/hooks/GoalMap/usePathGeneration'
import { useTaskStates } from '@/utilities/hooks/GoalMap/useTaskStates'
import { useAgentMovement } from '@/utilities/hooks/GoalMap/useAgentMovement'
import { useTaskActions } from '@/utilities/hooks/GoalMap/useTaskActions'
// Utilities
import { generateBackgroundElements,generateSmoothRoadPath } from '@/utilities/GoalMapUtils/pathUtils'
import { getStars,isLevelUnlocked, getOverallProgress } from '@/utilities/GoalMapUtils/gameUtils'
import { useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'
import { useWindowSize } from "react-use";

const CandyCrushGoalMap = () => {
  const { goalId } = useParams()
  const { user } = useSelector((state) => state.auth)
  const [hoveredLevel, setHoveredLevel] = useState(null)
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false); // Add confetti state
  const navigate = useNavigate()
  const { width, height } = useWindowSize(); // Custom hook for window dimensions
  
  useEffect(() => {
    if (headerRef.current) {
      const updateHeaderHeight = () => {
        setHeaderHeight(headerRef.current.offsetHeight);
      };
      
      updateHeaderHeight();
      window.addEventListener('resize', updateHeaderHeight);
      return () => window.removeEventListener('resize', updateHeaderHeight);
    }
  }, []);
  
  const headerRef = useRef(null);
  
  // Custom hooks
  const { selectedGoal, loading, error, allLevels } = useGoalData(goalId, user)
  const { pathPositions } = usePathGeneration(allLevels.length, { width: 0, height: 0 })
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

  const handleCelebration = () => {
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti and navigate after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/user/home');
    }, 3000);
  };

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
     {showConfetti && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}        
        recycle={false}             
        run={showConfetti}          
        gravity={0.3}               
        friction={0.99}             
        wind={0.05}                 
        initialVelocityY={-20}      
        colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b']} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
    )}
      
      <div ref={headerRef}>
        <MapHeader 
          selectedGoal={selectedGoal}
          completed={completed}
          total={total}
          percentage={percentage}
        />
      </div>

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
            availableHeight={`calc(100vh - ${headerHeight}px)`}
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
        onCelebrate={handleCelebration}
      />

      <FloatingActionButton goalId={goalId} />

      <Styles />
    </div>
  )
}

export default CandyCrushGoalMap