import React from 'react'

const Styles = () => {
  return (
    <style jsx>{`
      @keyframes sway {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
      }
      
      @keyframes sway-delayed {
        0%, 100% { transform: rotate(2deg); }
        50% { transform: rotate(-2deg); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes float-delayed {
        0%, 100% { transform: translateY(-5px); }
        50% { transform: translateY(5px); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes bounce-in {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes pulse-glow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(34, 197, 94, 0.4), 0 0 10px rgba(34, 197, 94, 0.2), 0 0 15px rgba(34, 197, 94, 0.1);
        }
        50% { 
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2);
        }
      }
      
      .animate-sway {
        animation: sway 3s ease-in-out infinite;
      }
      
      .animate-sway-delayed {
        animation: sway-delayed 3s ease-in-out infinite;
      }
      
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      
      .animate-float-delayed {
        animation: float-delayed 4s ease-in-out infinite;
      }
      
      .animate-shimmer {
        animation: shimmer 2s ease-in-out infinite;
      }
      
      .animate-bounce-in {
        animation: bounce-in 0.6s ease-out;
      }
      
      .animate-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }
      
      /* Custom scrollbar for tooltips */
      .overflow-y-auto::-webkit-scrollbar {
        width: 4px;
      }
      
      .overflow-y-auto::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 2px;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 2px;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `}</style>
  )
}

export default Styles