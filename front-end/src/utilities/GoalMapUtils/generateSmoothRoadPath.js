// utils/generateSmoothRoadPath.js
export const generateSmoothRoadPath = (positions) => {
  if (!positions || positions.length === 0) return "";

  let path = `M ${positions[0].x} ${positions[0].y}`; // Move to first node

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    
    // midpoint between prev and curr for smooth curve
   const midX = (prev.x + curr.x) / 2 + (Math.random() - 0.5) * 10;
    const midY = (prev.y + curr.y) / 2 + (Math.random() - 0.5) * 5;

    path += ` Q ${midX} ${midY}, ${curr.x} ${curr.y}`;
  }

  return path;
};
