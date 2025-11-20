import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, RefreshCw } from 'lucide-react';

interface Target {
  id: number;
  x: number;
  y: number;
  z: number; // Depth
  createdAt: number;
}

const GunShooter: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const containerRef = useRef<HTMLDivElement>(null);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnInterval = setInterval(() => {
      if (targets.length < 5) {
        const newTarget: Target = {
          id: Math.random(),
          x: Math.random() * 80 + 10, // 10% to 90%
          y: Math.random() * 60 + 10, // 10% to 70%
          z: Math.random() * 500, // Depth 0 to 500px
          createdAt: Date.now(),
        };
        setTargets((prev) => [...prev, newTarget]);
      }
    }, 600);

    return () => {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
    };
  }, [gameState, targets.length]);

  const handleShoot = (id: number) => {
    setScore((s) => s + 100);
    setTargets((prev) => prev.filter((t) => t.id !== id));
    // Play sound effect could go here
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameState('playing');
  };

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden relative select-none cursor-crosshair font-mono">
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-black/40 text-green-400 pointer-events-none">
        <div className="text-xl font-bold">SCORE: {score}</div>
        <div className="text-xl font-bold">TIME: {timeLeft}s</div>
      </div>

      {/* Game World (3D Perspective) */}
      <div 
        ref={containerRef}
        className="w-full h-full relative"
        style={{ perspective: '1000px' }}
      >
        {/* Floor Grid for 3D reference */}
        <div 
            className="absolute bottom-0 w-full h-[50%] bg-[linear-gradient(transparent_95%,rgba(0,255,0,0.2)_1px),linear-gradient(90deg,transparent_95%,rgba(0,255,0,0.2)_1px)]"
            style={{ 
                transform: 'rotateX(60deg) scale(2)', 
                backgroundSize: '40px 40px',
                transformOrigin: 'bottom center' 
            }}
        />

        {gameState === 'playing' && targets.map((target) => (
          <button
            key={target.id}
            onMouseDown={() => handleShoot(target.id)}
            className="absolute rounded-full bg-red-600 border-4 border-white shadow-[0_0_15px_rgba(255,0,0,0.8)] hover:bg-red-400 transition-colors"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: `translateZ(-${target.z}px)`,
              width: '60px',
              height: '60px',
              cursor: 'crosshair'
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1/2 h-1/2 bg-red-600 rounded-full"></div>
                </div>
            </div>
          </button>
        ))}
      </div>

      {/* Menu Overlays */}
      {gameState === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
          <Crosshair size={64} className="text-green-500 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">GUN SHOOTER 3D</h1>
          <p className="text-gray-400 mb-8">Eliminate targets before time runs out.</p>
          <button 
            onClick={startGame}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-500 transition-all"
          >
            START MISSION
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 text-white">
          <h2 className="text-5xl font-bold text-red-500 mb-4">MISSION OVER</h2>
          <div className="text-2xl mb-8">Final Score: <span className="text-yellow-400">{score}</span></div>
          <button 
            onClick={startGame}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded hover:bg-blue-500 transition-all"
          >
            <RefreshCw size={20} />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GunShooter;