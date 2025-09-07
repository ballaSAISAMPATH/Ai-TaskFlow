import React, { useRef, useEffect, useState } from "react";

const RoadPath = ({ pathPositions, containerWidth, containerHeight }) => {
  const svgRef = useRef(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSvgDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!pathPositions || pathPositions.length < 2) return null;

  // Use actual SVG dimensions instead of window dimensions
  const actualWidth = svgDimensions.width || containerWidth || window.innerWidth;
  const actualHeight = svgDimensions.height || containerHeight || window.innerHeight;

  // Create smooth curved path with proper stretching
  const createSmoothPath = (positions) => {
    if (positions.length < 2) return '';

    // Convert percentage to actual pixels
    const points = positions.map(pos => ({
      x: (pos.x / 100) * actualWidth,
      y: (pos.y / 100) * actualHeight
    }));

    let pathData = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const nextPoint = points[i + 1];

      if (i === points.length - 1) {
        // Last point - simple line
        pathData += ` L ${currentPoint.x},${currentPoint.y}`;
      } else {
        // Create smooth curves using quadratic Bezier curves
        const controlPointDistance = Math.min(
          Math.sqrt(Math.pow(currentPoint.x - prevPoint.x, 2) + Math.pow(currentPoint.y - prevPoint.y, 2)) * 0.9,
          50 // Max control point distance
        );

        // Calculate control point
        const angle = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x);
        const controlX = currentPoint.x + Math.cos(angle + Math.PI/2) * controlPointDistance;
        const controlY = currentPoint.y + Math.sin(angle + Math.PI/2) * controlPointDistance;

        pathData += ` Q ${controlX},${controlY} ${currentPoint.x},${currentPoint.y}`;
      }
    }

    return pathData;
  };

  const pathD = createSmoothPath(pathPositions);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Road shadow for depth */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2, 2)"
      />
      
      {/* Main road base */}
      <path
        d={pathD}
        fill="none"
        stroke="#4A5568"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Road surface */}
      <path
        d={pathD}
        fill="none"
        stroke="#718096"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Center line */}
      <path
        d={pathD}
        fill="none"
        stroke="#FBD38D"
        strokeWidth="3"
        strokeDasharray="15,10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Optional: Add road markers at intervals */}
      {pathPositions.map((pos, index) => {
        if (index % 2 === 0) { // Every other position
          const x = (pos.x / 100) * actualWidth;
          const y = (pos.y / 100) * actualHeight;
          return (
            <circle
              key={`marker-${index}`}
              cx={x}
              cy={y}
              r="2"
              fill="#F6E05E"
              opacity="0.7"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};

export default RoadPath;