
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const Parkour: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  
  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const SPEED = 5;
  
  // Refs for mutable game state
  const playerRef = useRef({ x: 50, y: 200, width: 30, height: 30, dy: 0, grounded: false });
  const obstaclesRef = useRef<{ x: number; y: number; w: number; h: number }[]>([]);
  const frameRef = useRef(0);
  const scoreRef = useRef(0);
  const gameLoopRef = useRef<number>(0);

  const resetGame = () => {
    playerRef.current = { x: 50, y: 200, width: 30, height: 30, dy: 0, grounded: false };
    obstaclesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    frameRef.current = 0;
  };

  const jump = useCallback(() => {
    if (playerRef.current.grounded) {
      playerRef.current.dy = JUMP_FORCE;
      playerRef.current.grounded = false;
    }
  }, []);

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 250, canvas.width, 50);

    // Player Physics
    const p = playerRef.current;
    p.dy += GRAVITY;
    p.y += p.dy;

    // Ground collision
    if (p.y + p.height >= 250) {
      p.y = 250 - p.height;
      p.dy = 0;
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    // Draw Player
    ctx.fillStyle = '#3b82f6'; // Blue square
    ctx.fillRect(p.x, p.y, p.width, p.height);
    // Add "eye" to look like a character
    ctx.fillStyle = 'white';
    ctx.fillRect(p.x + 20, p.y + 5, 5, 5);

    // Obstacle Logic
    frameRef.current++;
    scoreRef.current++;
    
    // Update score UI every 10 frames to avoid excessive renders
    if (frameRef.current % 10 === 0) {
        setScore(Math.floor(scoreRef.current / 10));
    }

    // Spawn obstacles
    if (frameRef.current % 100 === 0) { // Every ~1.5 seconds
        const height = 30 + Math.random() * 40;
        obstaclesRef.current.push({
            x: canvas.width,
            y: 250 - height,
            w: 20 + Math.random() * 20,
            h: height
        });
    }

    // Update and Draw Obstacles
    ctx.fillStyle = '#ef4444'; // Red obstacles
    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const obs = obstaclesRef.current[i];
      obs.x -= SPEED;

      // Collision Detection
      if (
        p.x < obs.x + obs.w &&
        p.x + p.width > obs.x &&
        p.y < obs.y + obs.h &&
        p.height + p.y > obs.y
      ) {
        setGameState('gameover');
        cancelAnimationFrame(gameLoopRef.current);
        return; // Stop loop
      }

      // Remove off-screen
      if (obs.x + obs.w < 0) {
        obstaclesRef.current.splice(i, 1);
      } else {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }
    }

    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      resetGame();
      gameLoopRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameState === 'playing') {
          jump();
        } else if (gameState !== 'playing' && e.code === 'Space') {
            setGameState('playing');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump]);

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center relative select-none" onClick={() => gameState === 'playing' && jump()}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={300} 
        className="bg-white shadow-lg border border-gray-300 rounded"
      />
      
      <div className="absolute top-4 right-8 text-xl font-bold text-gray-700 font-mono">
        SCORE: {score}
      </div>

      {gameState === 'start' && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white italic mb-2">PARKOUR 2D</h1>
          <p className="text-white/80 mb-6">Press Space or Click to Jump</p>
          <button 
            onClick={(e) => { e.stopPropagation(); setGameState('playing'); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold transition-all transform hover:scale-105"
          >
            <Play size={20} /> RUN
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4">CRASHED!</h2>
          <div className="text-xl text-yellow-400 mb-8 font-mono">Score: {score}</div>
          <button 
            onClick={(e) => { e.stopPropagation(); setGameState('playing'); }}
            className="bg-white text-black px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 font-bold"
          >
            <RotateCcw size={18} /> Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Parkour;
