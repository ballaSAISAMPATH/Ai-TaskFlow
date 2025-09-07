import { useState, useEffect } from 'react'

export const useAgentMovement = (allLevels, pathPositions, initialAnimationComplete) => {
  const [agentPosition, setAgentPosition] = useState({ x: 50, y: 85 })
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(false)

  const animateInitialTravel = (targetIndex, positions) => {
    if (targetIndex === 0 || positions.length === 0) {
      const position = positions[0] || { x: 50, y: 85 }
      setAgentPosition(position)
      return
    }

    setIsMoving(true)
    let currentIndex = 0
    
    const moveToNextNode = () => {
      if (currentIndex >= targetIndex) {
        setIsMoving(false)
        return
      }
      
      const position = positions[currentIndex] || { x: 50, y: 85 }
      setAgentPosition(position)
      currentIndex++
      
      setTimeout(moveToNextNode, 300)
    }
    
    moveToNextNode()
  }

  const moveAgentToNextLevel = () => {
    const completedLevels = allLevels.filter(level => level.status).length
    const newLevelIndex = Math.min(completedLevels, allLevels.length - 1)
    
    if (newLevelIndex !== currentLevelIndex && newLevelIndex < pathPositions.length) {
      setIsMoving(true)
      const newPosition = pathPositions[newLevelIndex]
      
      setTimeout(() => {
        setAgentPosition(newPosition)
        setCurrentLevelIndex(newLevelIndex)
        setIsMoving(false)
      }, 800)
    }
  }

  useEffect(() => {
    if (allLevels.length > 0 && !initialAnimationComplete && pathPositions.length > 0) {
      const completedLevels = allLevels.filter(level => level.status).length
      const newCurrentIndex = Math.min(completedLevels, allLevels.length - 1)
      setCurrentLevelIndex(newCurrentIndex)
      animateInitialTravel(newCurrentIndex, pathPositions)
    }
  }, [allLevels, pathPositions, initialAnimationComplete])

  return {
    agentPosition,
    setAgentPosition,
    currentLevelIndex,
    setCurrentLevelIndex,
    isMoving,
    setIsMoving,
    moveAgentToNextLevel
  }
}