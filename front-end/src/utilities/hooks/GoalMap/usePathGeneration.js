import { useState, useEffect, useMemo } from 'react'

export const usePathGeneration = (levelCount) => {
  const [pathPositions, setPathPositions] = useState([])
  const [screenSize, setScreenSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  })

  // Listen for window resize to update responsiveness
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const generateDynamicPath = useMemo(() => {
    return (levelCount, screenWidth) => {
      if (levelCount === 0) return []
      if (levelCount === 1) return [{ x: 50, y: 85 }]

      const positions = []
      const mapWidth = 100
      
      // Responsive breakpoints
      const isMobile = screenWidth < 768
      const isTablet = screenWidth >= 768 && screenWidth < 1024
      const isDesktop = screenWidth >= 1024
      
      // Dynamic parameters that adjust based on screen size
      const horizontalMargin = isMobile ? -15 : isTablet ? -12 : -12
      const verticalMargin = isMobile ? 20 : isTablet ? 25 : 30
      const minVerticalSpacing = isMobile ? 35 : isTablet ? 30 : 45
      const maxLevelsPerRow = isMobile ? 2 : isTablet ? 3 : 4
      const minLevelsPerRow = isMobile ? 1 : 2
      const optimalLevelsPerRow = Math.max(minLevelsPerRow, Math.min(maxLevelsPerRow, Math.ceil(Math.sqrt(levelCount))))
      const topBottomBuffer = isMobile ? -60 : isTablet ? -40 : -40
      const curvatureDivisor = isMobile ? 8 : isTablet ? 7 : 6
      const curvatureMultiplier = isMobile ? 2 : isTablet ? 2.5 : 3
      
      // Calculate derived values
      const rows = Math.ceil(levelCount / optimalLevelsPerRow)
      const usableWidth = mapWidth - (horizontalMargin * 2)
      
      // Dynamic height calculation based on all parameters
      const mapHeight = topBottomBuffer + (rows * minVerticalSpacing) + minVerticalSpacing
      const usableHeight = mapHeight - (horizontalMargin * 2)
      
      // Use the exact desired spacing since height is calculated to accommodate it
      const verticalSpacing = minVerticalSpacing
      
      let currentLevel = 0
      let direction = 1
      
      for (let row = 0; row < rows && currentLevel < levelCount; row++) {
        const levelsInThisRow = Math.min(optimalLevelsPerRow, levelCount - currentLevel)
        const horizontalSpacing = usableWidth / (levelsInThisRow + 1)
        const y = verticalMargin + (row * verticalSpacing)
        
        for (let col = 0; col < levelsInThisRow && currentLevel < levelCount; col++) {
          let x = direction === 1 
            ? horizontalMargin + ((col + 1) * horizontalSpacing)
            : horizontalMargin + ((levelsInThisRow - col) * horizontalSpacing)
          
          const curvatureOffset = Math.sin((currentLevel * Math.PI) / curvatureDivisor) * curvatureMultiplier
          x += curvatureOffset
          x = Math.max(horizontalMargin, Math.min(mapWidth - horizontalMargin, x))
          
          positions.push({ x, y })
          currentLevel++
        }
        direction *= -1
      }
      return positions
    }
  }, [])

  useEffect(() => {
    const positions = generateDynamicPath(levelCount, screenSize.width)
    setPathPositions(positions)
  }, [levelCount, screenSize.width, generateDynamicPath])

  return { pathPositions, setPathPositions }
}