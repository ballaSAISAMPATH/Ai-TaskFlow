import React, { useState, useEffect, useCallback, useRef } from 'react';

const LoadingSpinner = () => {
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [aiMessages, setAiMessages] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [level, setLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [collectedTasks, setCollectedTasks] = useState([]);
  const [particles, setParticles] = useState([]);
  const gameAreaRef = useRef(null);
  const playerRef = useRef(null);

  const taskTemplates = [
    { text: "Plan weekly goals", points: 100, difficulty: 1, emoji: "📅" },
    { text: "Organize daily tasks", points: 80, difficulty: 1, emoji: "📋" },
    { text: "Set up automation", points: 150, difficulty: 2, emoji: "⚙️" },
    { text: "Review task progress", points: 90, difficulty: 1, emoji: "📊" },
    { text: "Optimize workflow", points: 120, difficulty: 2, emoji: "🔄" },
    { text: "Generate AI insights", points: 200, difficulty: 3, emoji: "🧠" },
    { text: "Sync with calendar", points: 110, difficulty: 2, emoji: "📱" },
    { text: "Create categories", points: 70, difficulty: 1, emoji: "🏷️" },
    { text: "Set priorities", points: 85, difficulty: 1, emoji: "🎯" },
    { text: "Enable notifications", points: 95, difficulty: 2, emoji: "🔔" }
  ];

  const aiMessageTemplates = [
    "🤖 AI Assistant: Excellent movement! Tasks collected efficiently!",
    "🧠 AI Planner: Your navigation skills are improving productivity!",
    "⚡ AI Optimizer: Smooth task collection! Workflow optimized!",
    "🎯 AI Tracker: Perfect positioning! Keep collecting!",
    "🚀 AI Booster: Speed bonus activated! You're on fire!",
    "💡 AI Insights: Movement pattern analyzed - very efficient!",
    "🔥 AI Motivator: Drag and drop mastery achieved!",
    "📊 AI Analytics: 100% task collection rate - Amazing!"
  ];

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setDragOffset({
        x: clientX - rect.left - (playerPosition.x * rect.width / 100),
        y: clientY - rect.top - (playerPosition.y * rect.height / 100)
      });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const newX = Math.max(5, Math.min(95, ((clientX - rect.left - dragOffset.x) / rect.width) * 100));
    const newY = Math.max(5, Math.min(95, ((clientY - rect.top - dragOffset.y) / rect.height) * 100));
    
    setPlayerPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard controls
  const handleKeyPress = useCallback((e) => {
    const speed = 3;
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newY = Math.max(5, prev.y - speed);
          break;
        case 's':
        case 'arrowdown':
          newY = Math.min(95, prev.y + speed);
          break;
        case 'a':
        case 'arrowleft':
          newX = Math.max(5, prev.x - speed);
          break;
        case 'd':
        case 'arrowright':
          newX = Math.min(95, prev.x + speed);
          break;
      }
      
      return { x: newX, y: newY };
    });
  }, []);

  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleMouseMove, handleKeyPress]);

  const generateTask = useCallback(() => {
    const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
    const maxDifficulty = Math.min(3, Math.floor(level / 2) + 1);
    const filteredTemplates = taskTemplates.filter(t => t.difficulty <= maxDifficulty);
    const selectedTemplate = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
    
    return {
      id: Date.now() + Math.random(),
      text: selectedTemplate.text,
      emoji: selectedTemplate.emoji,
      points: selectedTemplate.points * level,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      difficulty: selectedTemplate.difficulty,
      color: selectedTemplate.difficulty === 1 ? 'bg-green-400' : 
             selectedTemplate.difficulty === 2 ? 'bg-emerald-500' : 'bg-green-600',
      velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 }
    };
  }, [level]);

  // Check collision between player and tasks
  const checkCollisions = useCallback(() => {
    tasks.forEach(task => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - task.x, 2) + 
        Math.pow(playerPosition.y - task.y, 2)
      );
      
      if (distance < 8) {
        // Task collected!
        setScore(prev => prev + task.points);
        setCompletedTasks(prev => prev + 1);
        setTasks(prev => prev.filter(t => t.id !== task.id));
        
        // Add to collected tasks for animation
        setCollectedTasks(prev => [...prev, { ...task, collectedAt: Date.now() }]);
        
        // Create particles
        const newParticles = [...Array(8)].map((_, i) => ({
          id: Date.now() + i,
          x: task.x,
          y: task.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1
        }));
        setParticles(prev => [...prev, ...newParticles]);
        
        // Show celebration
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 500);
        
        // Add AI message
        const message = aiMessageTemplates[Math.floor(Math.random() * aiMessageTemplates.length)];
        setAiMessages(prev => [...prev.slice(-2), { text: message, id: Date.now() }]);
        
        // Level up every 10 tasks
        if ((completedTasks + 1) % 10 === 0) {
          setLevel(prev => prev + 1);
        }
      }
    });
  }, [playerPosition, tasks, completedTasks]);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Task generation and movement
  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Generate new tasks
      if (tasks.length < 6) {
        setTasks(prev => [...prev, generateTask()]);
      }
      
      // Move existing tasks
      setTasks(prev => prev.map(task => ({
        ...task,
        x: Math.max(5, Math.min(95, task.x + task.velocity.x)),
        y: Math.max(10, Math.min(85, task.y + task.velocity.y)),
        velocity: {
          x: task.x <= 5 || task.x >= 95 ? -task.velocity.x : task.velocity.x,
          y: task.y <= 10 || task.y >= 85 ? -task.velocity.y : task.velocity.y
        }
      })));
      
      // Update particles
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02,
        vx: p.vx * 0.98,
        vy: p.vy * 0.98
      })).filter(p => p.life > 0));
      
      // Check collisions
      checkCollisions();
    }, 50);

    return () => clearInterval(gameLoop);
  }, [generateTask, checkCollisions, tasks.length]);

  // Clean up collected tasks
  useEffect(() => {
    const cleanup = setInterval(() => {
      setCollectedTasks(prev => prev.filter(t => Date.now() - t.collectedAt < 2000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Auto-remove old AI messages
  useEffect(() => {
    if (aiMessages.length > 0) {
      const timer = setTimeout(() => {
        setAiMessages(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [aiMessages]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden select-none">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-green-300" style={{ top: `${i * 10}%` }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-green-300" style={{ left: `${i * 10}%` }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-2 animate-pulse">
          AI-TaskFlow Loading...
        </h1>
        <p className="text-green-600 mb-3 text-sm">Drag the AI agent to collect tasks! Use WASD or arrow keys</p>
        
        <div className="flex justify-center space-x-4 text-xs">
          <div className="bg-white/80 px-3 py-2 rounded-lg shadow">
            <div className="text-green-800 font-bold">{score}</div>
            <div className="text-green-600">Score</div>
          </div>
          <div className="bg-white/80 px-3 py-2 rounded-lg shadow">
            <div className="text-green-800 font-bold">{completedTasks}</div>
            <div className="text-green-600">Tasks</div>
          </div>
          <div className="bg-white/80 px-3 py-2 rounded-lg shadow">
            <div className="text-green-800 font-bold">Lv.{level}</div>
            <div className="text-green-600">AI Level</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="relative flex-1 cursor-pointer"
        style={{ height: 'calc(100% - 120px)' }}
      >
        {/* Player (AI Agent) */}
        <div
          ref={playerRef}
          className={`absolute w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-lg border-2 border-white cursor-grab transition-all duration-100 ${isDragging ? 'scale-110 shadow-2xl cursor-grabbing' : 'hover:scale-105'}`}
          style={{
            left: `${playerPosition.x}%`,
            top: `${playerPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 20
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
            🤖
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-white/30 animate-spin" style={{ animationDuration: '3s' }} />
          
          {/* Player trail effect */}
          {isDragging && (
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
          )}
        </div>

        {/* Moving Tasks */}
        {tasks.map(task => (
          <div
            key={task.id}
            className={`absolute transition-all duration-100 ${task.color} p-2 rounded-lg shadow-lg text-white text-xs font-medium hover:scale-105`}
            style={{
              left: `${task.x}%`,
              top: `${task.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <div className="text-center">
              <div className="text-lg mb-1">{task.emoji}</div>
              <div className="text-xs leading-tight">{task.text}</div>
              <div className="text-xs opacity-80 mt-1">+{task.points}</div>
            </div>
          </div>
        ))}

        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: particle.life,
              zIndex: 15
            }}
          />
        ))}

        {/* Collected Tasks Animation */}
        {collectedTasks.map(task => (
          <div
            key={`collected-${task.id}`}
            className="absolute text-green-600 font-bold animate-bounce pointer-events-none"
            style={{
              left: `${playerPosition.x}%`,
              top: `${playerPosition.y - 10}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              animation: 'float-up 2s ease-out forwards'
            }}
          >
            +{task.points}
          </div>
        ))}

        {/* Celebration Effect */}
        {showCelebration && (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: `${playerPosition.x}%`,
              top: `${playerPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 30
            }}
          >
            <div className="text-3xl animate-ping">🎉</div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.cos(i * Math.PI / 3) * 30}px`,
                  top: `${Math.sin(i * Math.PI / 3) * 30}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Messages */}
      <div className="absolute bottom-16 left-4 right-4 z-20">
        {aiMessages.map(msg => (
          <div
            key={msg.id}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg mb-2 border-l-4 border-green-500 animate-slide-in text-sm"
          >
            <div className="text-green-800 font-medium">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Loading Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-200">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
          style={{ width: `${Math.min(100, (gameTime / 45) * 100)}%` }}
        />
      </div>

      {/* Controls Help */}
      <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-lg shadow text-xs">
        <div className="text-green-600 mb-1">Controls:</div>
        <div className="text-green-800">🖱️ Drag AI Agent</div>
        <div className="text-green-800">⌨️ WASD / Arrow Keys</div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -200%) scale(1.5); opacity: 0; }
        }
        
        @keyframes slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0%); opacity: 1; }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;