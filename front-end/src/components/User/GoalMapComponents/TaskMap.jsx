import React from 'react'
import BackgroundElements from './BackgroundElements'
import RoadPath from './RoadPath'
import MapLevel from './MapLevel'
import Agent from './Agent'

const TaskMap = ({ 
  backgroundElements,
  roadPath,
  allLevels,
  pathPositions,
  isLevelUnlocked,
  getStars,
  getTaskCompletionCount,
  setHoveredLevel,
  hoveredLevel,
  isTaskCompleted,
  handleIndividualTaskToggle,
  agentPosition,
  isMoving
}) => {
  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      {/* Background Elements */}
      <BackgroundElements backgroundElements={backgroundElements} />

      {/* Road Path */}
      <div className="absolute inset-0 w-full h-full">
      <RoadPath 
        pathPositions={pathPositions} 
        containerWidth={window.innerWidth} 
        containerHeight={window.innerHeight}
      />
      </div>

      {/* Map Container */}
      <div className="relative w-full h-full">
        {allLevels.map((level, mapIndex) => (
          <MapLevel
            key={`${level.type}-${level.index}-${mapIndex}`}
            level={level}
            levelIndex={mapIndex}
            pathPositions={pathPositions}
            isLevelUnlocked={isLevelUnlocked}
            getStars={getStars}
            getTaskCompletionCount={getTaskCompletionCount}
            setHoveredLevel={setHoveredLevel}
            hoveredLevel={hoveredLevel}
            isTaskCompleted={isTaskCompleted}
            handleIndividualTaskToggle={handleIndividualTaskToggle}
          />
        ))}

        {/* Render the moving agent */}
        {pathPositions.length > 0 && (
          <Agent agentPosition={agentPosition} isMoving={isMoving} />
        )}
      </div>
    </div>
  )
}


export default TaskMap