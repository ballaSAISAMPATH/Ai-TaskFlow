import { useState, useEffect, useMemo } from 'react'

export const usePathGeneration = (levelCount) => {
  const [pathPositions, setPathPositions] = useState([])

  const generateDynamicPath = useMemo(() => {
    return (levelCount) => {
      if (levelCount === 0) return []
      if (levelCount === 1) return [{ x: 50, y: 85 }]

      const positions = []
      const mapWidth = 100
      const mapHeight = 100
      const margin =-10
      const usableWidth = mapWidth - (margin * 2)
      const usableHeight = mapHeight - (margin * 2)
      
      const minVerticalSpacing = 25
      const optimalLevelsPerRow = Math.max(2, Math.min(4, Math.ceil(Math.sqrt(levelCount))))
      const rows = Math.ceil(levelCount / optimalLevelsPerRow)
      const verticalSpacing = Math.max(minVerticalSpacing, usableHeight / (rows + 1))
      
      let currentLevel = 0
      let direction = 1
      
      for (let row = 0; row < rows && currentLevel < levelCount; row++) {
        const levelsInThisRow = Math.min(optimalLevelsPerRow, levelCount - currentLevel)
        const horizontalSpacing = usableWidth / (levelsInThisRow+1)
        const y = mapHeight - margin - (row * verticalSpacing)
        
        for (let col = 0; col < levelsInThisRow && currentLevel < levelCount; col++) {
          let x = direction === 1 
            ? margin + ((col + 1) * horizontalSpacing)
            : margin + ((levelsInThisRow - col) * horizontalSpacing)
          
          const curvatureOffset = Math.sin((currentLevel * Math.PI) / 6) * 3
          x += curvatureOffset
          x = Math.max(margin, Math.min(mapWidth - margin, x))
          
          positions.push({ x, y })
          currentLevel++
        }
        direction *= -1
      }
      return positions
    }
  }, [])

  useEffect(() => {
    const positions = generateDynamicPath(levelCount)
    setPathPositions(positions)
  }, [levelCount, generateDynamicPath])

  return { pathPositions, setPathPositions }
}
