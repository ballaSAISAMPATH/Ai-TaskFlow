import React from 'react'
import { TreePine, Mountain } from 'lucide-react'

const BackgroundElements = ({ backgroundElements }) => {
  return (
    <div className="absolute inset-0">
      {/* Dynamic background elements */}
      {backgroundElements.map((element) => (
        <div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.animationDelay}s`
          }}
        >
          {element.type === 'tree' ? (
            <TreePine 
              className="text-green-400 animate-sway" 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity 
              }}
            />
          ) : (
            <Mountain 
              className="text-gray-300" 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity 
              }}
            />
          )}
        </div>
      ))}
      
      {/* Animated Clouds */}
      <div className="absolute top-[10%] left-[30%] w-16 h-8 bg-white opacity-20 rounded-full animate-float"></div>
      <div className="absolute top-[20%] right-[20%] w-12 h-6 bg-white opacity-20 rounded-full animate-float-delayed"></div>
      <div className="absolute top-[50%] left-[60%] w-14 h-7 bg-white opacity-20 rounded-full animate-float"></div>
      <div className="absolute bottom-[30%] right-[40%] w-10 h-5 bg-white opacity-15 rounded-full animate-float-delayed"></div>
    </div>
  )
}

export default BackgroundElements