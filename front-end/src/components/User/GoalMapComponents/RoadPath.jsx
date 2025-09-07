// RoadPath.jsx
import React from "react";

const RoadPath = ({ pathPositions, containerWidth, containerHeight }) => {
  if (!pathPositions || pathPositions.length < 2) return null;

  const pathD = pathPositions
    .map((pos, index) => {
      const x = (pos.x / 100) * containerWidth;
      const y = (pos.y / 100) * containerHeight;
      return index === 0 ? `M ${x},${y}` : `L ${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathD}
        fill="none"
        stroke="#333"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke="yellow"
        strokeWidth="4"
        strokeDasharray="10,10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RoadPath;
