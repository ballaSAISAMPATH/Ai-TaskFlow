export const generateSmoothRoadPath = (positions) => {
  if (positions.length < 2) return ""
  if (positions.length === 2) {
    return `M ${positions[0].x} ${positions[0].y} L ${positions[1].x} ${positions[1].y}`
  }
  
  let pathData = `M ${positions[0].x} ${positions[0].y}`
  
  for (let i = 1; i < positions.length; i++) {
    const current = positions[i]
    const prev = positions[i - 1]
    const next = positions[i + 1]
    
    if (i === 1) {
      const controlX = prev.x + (current.x - prev.x) * 0.6
      const controlY = prev.y + (current.y - prev.y) * 0.4
      pathData += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`
    } else {
      const tension = 0.3
      let controlX, controlY
      
      if (next) {
        const prevDirection = { x: current.x - prev.x, y: current.y - prev.y }
        const nextDirection = { x: next.x - current.x, y: next.y - current.y }
        
        controlX = current.x - (prevDirection.x * tension) + (nextDirection.x * tension * 0.5)
        controlY = current.y - (prevDirection.y * tension) + (nextDirection.y * tension * 0.5)
      } else {
        controlX = prev.x + (current.x - prev.x) * 0.7
        controlY = prev.y + (current.y - prev.y) * 0.7
      }
      
      pathData += ` S ${controlX} ${controlY} ${current.x} ${current.y}`
    }
  }
  
  return pathData
}

export const generateBackgroundElements = (levelCount, pathPositions) => {
  const elementCount = Math.min(12, Math.max(6, Math.floor(levelCount / 3)))
  const elements = []
  
  for (let i = 0; i < elementCount; i++) {
    const element = {
      id: i,
      type: Math.random() < 0.6 ? 'tree' : 'mountain',
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 20 + Math.random() * 40,
      opacity: 0.2 + Math.random() * 0.2,
      animationDelay: Math.random() * 2
    }
    
    const tooCloseToPath = pathPositions.some(pos => 
      Math.abs(pos.x - element.x) < 10 && Math.abs(pos.y - element.y) < 10
    )
    
    if (!tooCloseToPath) {
      elements.push(element)
    }
  }
  
  return elements
}