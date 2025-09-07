// utils/pathGenerator.js
export const generatePathPositions = (
  rows,
  cols,
  spacingX = 120,
  spacingY = 120,
  margin = 100,
  containerWidth = window.innerWidth,
  containerHeight = window.innerHeight
) => {
  const positions = [];
  const totalWidth = (cols - 1) * spacingX + margin * 2;
  const totalHeight = (rows - 1) * spacingY + margin * 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colIndex = r % 2 === 0 ? c : cols - 1 - c; // snake/zigzag
      const x = colIndex * spacingX + margin;
      const y = r * spacingY + margin;

      positions.push({
        x: (x / totalWidth) * 100,  // convert to %
        y: (y / totalHeight) * 100, // convert to %
      });
    }
  }
  return positions;
};
