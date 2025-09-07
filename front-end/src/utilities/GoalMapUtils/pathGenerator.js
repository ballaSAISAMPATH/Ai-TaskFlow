// utils/pathGenerator.js
export const generatePathPositions = (rows, cols) => {
  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colIndex = r % 2 === 0 ? c : cols - 1 - c; // zigzag snake
      positions.push({ x: colIndex, y: r });
    }
  }
  return positions;
};
