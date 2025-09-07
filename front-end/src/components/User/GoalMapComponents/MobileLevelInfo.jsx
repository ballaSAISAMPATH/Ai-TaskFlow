import React from 'react'

const MobileLevelInfo = ({ hoveredLevel, allLevels, setHoveredLevel }) => {
  if (hoveredLevel === null) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:hidden bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
      {allLevels[hoveredLevel] && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-800">{allLevels[hoveredLevel].label}</h4>
            <button 
              onClick={() => setHoveredLevel(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-gray-600">
            Level {hoveredLevel + 1} • {allLevels[hoveredLevel].type}
          </div>
        </>
      )}
    </div>
  )
}

export default MobileLevelInfo