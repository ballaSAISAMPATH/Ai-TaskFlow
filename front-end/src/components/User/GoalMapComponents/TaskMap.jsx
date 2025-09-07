import React, { useRef, useEffect, useState } from 'react';
import BackgroundElements from './BackgroundElements';
import RoadPath from './RoadPath';
import MapLevel from './MapLevel';
import Agent from './Agent';

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
  isMoving,
  availableHeight
}) => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100vh] overflow-y-scroll"
      style={{ 
        height: availableHeight || '600px',
        minHeight: '600px'
      }}
    >
      {/* Background Elements */}
      <BackgroundElements backgroundElements={backgroundElements} />

      {/* Road Path */}
      <div className="absolute inset-0 w-full h-full">
        <RoadPath 
          pathPositions={pathPositions} 
          containerWidth={containerDimensions.width} 
          containerHeight={containerDimensions.height}
        />
      </div>

      {/* Map Container with improved positioning */}
      <div className="relative w-full h-full">
        {allLevels.map((level, mapIndex) => {
          // Ensure path position exists before rendering
          if (!pathPositions[mapIndex]) return null;
          
          return (
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
              containerDimensions={containerDimensions}
            />
          );
        })}

        {/* Render the moving agent */}
        {pathPositions.length > 0 && (
          <Agent 
            agentPosition={agentPosition} 
            isMoving={isMoving}
            containerDimensions={containerDimensions}
          />
        )}
      </div>
    </div>
  );
};

export default TaskMap;