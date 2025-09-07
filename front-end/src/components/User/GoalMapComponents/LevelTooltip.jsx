// LevelTooltip.jsx
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Circle, Lock } from 'lucide-react'

const DEFAULT_WIDTH = 260
const DEFAULT_HEIGHT = 160
const OFFSET = 8

// Compute best top/left + placement using DOMRects
function computePlacement(anchorRect, tooltipRect, offset = OFFSET) {
  const iw = window.innerWidth
  const ih = window.innerHeight
  const centerX = anchorRect.left + anchorRect.width / 2

  // start with top
  let top = anchorRect.top - tooltipRect.height - offset
  let left = centerX - tooltipRect.width / 2
  let placement = 'top'

  // not enough space above -> bottom
  if (top < offset) {
    top = anchorRect.bottom + offset
    placement = 'bottom'
  }

  // horizontal clamping
  if (left < offset) left = offset
  if (left + tooltipRect.width > iw - offset) left = Math.max(offset, iw - tooltipRect.width - offset)

  // if bottom placement causes overflow vertically, try right
  if (top + tooltipRect.height > ih - offset) {
    // try right side
    placement = 'right'
    top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2
    left = anchorRect.right + offset

    // if right side overflows, try left side
    if (left + tooltipRect.width > iw - offset) {
      placement = 'left'
      left = anchorRect.left - tooltipRect.width - offset
      top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2
    }

    // clamp vertical
    if (top < offset) top = offset
    if (top + tooltipRect.height > ih - offset) top = Math.max(offset, ih - tooltipRect.height - offset)
  }

  return { top, left, placement }
}

const LevelTooltip = ({
  level,
  levelIndex,
  hoveredLevel,
  getTaskCompletionCount,
  isLevelUnlocked,
  isTaskCompleted,
  handleIndividualTaskToggle,
  anchorRef,
  setHoveredLevel // optional, but recommended so tooltip can keep itself open
}) => {
  const [coords, setCoords] = useState(null) // { top, left, placement }
  const tooltipRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let mountedFlag = true
    if (hoveredLevel !== levelIndex) {
      setCoords(null)
      setMounted(false)
      return
    }

    // when hover starts, mount tooltip (invisibly) then measure and place
    setMounted(true)

    const updatePosition = () => {
      if (!anchorRef?.current) return
      const anchorRect = anchorRef.current.getBoundingClientRect()

      // tooltipRect: try measure actual rendered element; fallback to defaults
      const tr = tooltipRef.current
      const tooltipRect = tr
        ? { width: tr.offsetWidth || DEFAULT_WIDTH, height: tr.offsetHeight || DEFAULT_HEIGHT }
        : { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }

      const pos = computePlacement(anchorRect, tooltipRect)
      if (mountedFlag) setCoords(pos)
    }

    // small timeout to ensure tooltip has rendered and width/height available
    const t = setTimeout(updatePosition, 0)

    // reposition on scroll/resize
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      mountedFlag = false
      clearTimeout(t)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [hoveredLevel, levelIndex, anchorRef])

  if (hoveredLevel !== levelIndex) return null
  if (!anchorRef?.current) return null

  const { type: taskType, index: groupIndex, tasks = [], label } = level
  const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
  const isUnlocked = isLevelUnlocked(levelIndex)

  // render tooltip in portal. When coords is null we render invisibly to measure, then become visible.
  const styleBase = {
    position: 'fixed',
    zIndex: 9999,
    width: `${DEFAULT_WIDTH}px`,
    pointerEvents: 'auto' // allow clicks
  }

  const style = coords
    ? { ...styleBase, top: `${coords.top}px`, left: `${coords.left}px`, visibility: 'visible' }
    : { ...styleBase, top: 0, left: 0, visibility: 'hidden' }

  const tooltip = (
    <div
      ref={tooltipRef}
      className="rounded-xl shadow-2xl border border-gray-200 p-4 bg-white"
      style={style}
      onMouseEnter={() => {
        if (setHoveredLevel) setHoveredLevel(levelIndex)
      }}
      onMouseLeave={() => {
        if (setHoveredLevel) setHoveredLevel(null)
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 truncate">{label}</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium capitalize">
          {taskType}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs font-medium text-gray-800">
            {completed}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      {isUnlocked && tasks.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {tasks.slice(0, 3).map((taskContent, taskIndex) => {
            const completedFlag = isTaskCompleted(taskType, groupIndex, taskIndex)
            return (
              <div
                key={taskIndex}
                className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleIndividualTaskToggle(taskType, groupIndex, taskIndex)}
              >
                {completedFlag ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 hover:text-green-500" />
                )}
                <p className={`text-xs leading-relaxed ${completedFlag ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {taskContent}
                </p>
              </div>
            )
          })}
          {tasks.length > 3 && <div className="text-xs text-gray-500 text-center pt-2 border-t">+{tasks.length - 3} more tasks</div>}
        </div>
      )}

      {!isUnlocked && (
        <div className="text-center py-2">
          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Complete previous level to unlock</p>
        </div>
      )}

      {/* Arrow — rendered relative to placement (adjust with coords.placement) */}
      {coords && coords.placement === 'top' && (
        <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)' }}>
          <div className="border-8 border-transparent border-t-white"></div>
        </div>
      )}
      {coords && coords.placement === 'bottom' && (
        <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
          <div className="border-8 border-transparent border-b-white"></div>
        </div>
      )}
      {coords && coords.placement === 'right' && (
        <div style={{ position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)' }}>
          <div className="border-8 border-transparent border-r-white"></div>
        </div>
      )}
      {coords && coords.placement === 'left' && (
        <div style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)' }}>
          <div className="border-8 border-transparent border-l-white"></div>
        </div>
      )}
    </div>
  )

  return createPortal(tooltip, document.body)
}

export default LevelTooltip
