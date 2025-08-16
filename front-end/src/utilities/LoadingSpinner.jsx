import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden">
      <div className="relative">
        <div className="w-24 h-24 relative">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-4 border-green-400"
              style={{
                clipPath: i === 0 
                  ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                  : i === 1
                  ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                  : 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                animation: `morph${i + 1} 3s ease-in-out infinite`,
                animationDelay: `${i * 1}s`
              }}
            />
          ))}
          
          <div className="absolute inset-6 bg-gradient-to-br from-green-300 to-emerald-500 rounded-full animate-pulse shadow-2xl shadow-green-500/50"></div>
        </div>

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-green-500 rounded-full shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: '0 0',
              transform: `rotate(${i * 90}deg) translateX(60px) translateY(-6px)`,
              animation: `orbit 2s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>



      <div className="absolute inset-0">
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
          style={{
            animation: 'scanVertical 3s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
          style={{
            animation: 'scanHorizontal 4s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes morph1 {
          0%, 100% { 
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            transform: rotate(0deg) scale(1);
          }
          33% { 
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            transform: rotate(72deg) scale(1.1);
          }
          66% { 
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
            transform: rotate(144deg) scale(0.9);
          }
        }
        
        @keyframes morph2 {
          0%, 100% { 
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            transform: rotate(0deg) scale(0.8);
          }
          33% { 
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
            transform: rotate(-72deg) scale(1.2);
          }
          66% { 
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            transform: rotate(-144deg) scale(0.7);
          }
        }
        
        @keyframes morph3 {
          0%, 100% { 
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
            transform: rotate(0deg) scale(1.1);
          }
          50% { 
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            transform: rotate(180deg) scale(0.6);
          }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(60px) translateY(-6px); }
          to { transform: rotate(360deg) translateX(60px) translateY(-6px); }
        }

@keyframes scanVertical {
          0% { top: -2px; }
          100% { top: 100%; }
        }

        @keyframes scanHorizontal {
          0% { left: -2px; }
          100% { left: 100%; }
        }


      `}</style>
    </div>
  );
};

export default LoadingSpinner;