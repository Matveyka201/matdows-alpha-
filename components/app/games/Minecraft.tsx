
import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, Hammer, Shovel, Play, User, ChevronDown, Loader2, Shirt } from 'lucide-react';
import { playClick } from '../../../services/soundService';

const BLOCK_SIZE = 32;
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 50;
const GRAVITY = 0.5;
const TERMINAL_VELOCITY = 12;
const PLAYER_SPEED = 5;
const JUMP_FORCE = -10;

// Block Types
const BLOCKS = {
  AIR: 0,
  DIRT: 1,
  GRASS: 2,
  STONE: 3,
  WOOD: 4,
  LEAVES: 5,
  BRICK: 6
};

const BLOCK_COLORS = {
  [BLOCKS.AIR]: 'transparent',
  [BLOCKS.DIRT]: '#8B4513',
  [BLOCKS.GRASS]: '#556B2F', // Side color, top handled separately
  [BLOCKS.STONE]: '#708090',
  [BLOCKS.WOOD]: '#A0522D',
  [BLOCKS.LEAVES]: '#228B22',
  [BLOCKS.BRICK]: '#800000'
};

const SKINS = [
  { id: 'steve', name: 'Steve', bodyColor: '#3b82f6', headColor: '#fca5a5', legs: '#1e3a8a' },
  { id: 'alex', name: 'Alex', bodyColor: '#65a30d', headColor: '#fca5a5', legs: '#3f2c22' },
  { id: 'zombie', name: 'Zombie', bodyColor: '#2563eb', headColor: '#4ade80', legs: '#1e3a8a' },
  { id: 'creeper', name: 'Creeper', bodyColor: '#4ade80', headColor: '#22c55e', legs: '#000000' },
  { id: 'enderman', name: 'Ender', bodyColor: '#111827', headColor: '#000000', legs: '#111827' },
  { id: 'iron', name: 'Iron Man', bodyColor: '#e2e8f0', headColor: '#94a3b8', legs: '#64748b' },
];

const Minecraft: React.FC = () => {
  // State for Launcher vs Game
  const [appState, setAppState] = useState<'launcher' | 'loading' | 'game'>('launcher');
  const [launcherTab, setLauncherTab] = useState<'play' | 'skins' | 'installations' | 'patchnotes'>('play');
  const [username, setUsername] = useState('Steve');
  const [version, setVersion] = useState('Release 1.20.4');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBlock, setSelectedBlock] = useState(BLOCKS.DIRT);
  
  // Game State Refs (for performance loop)
  const playerRef = useRef({
    x: WORLD_WIDTH * BLOCK_SIZE / 2,
    y: 100,
    vx: 0,
    vy: 0,
    width: 20,
    height: 56,
    grounded: false
  });
  
  const mapRef = useRef<number[][]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const cameraRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  // --- Launcher Logic ---
  const handlePlayClick = () => {
    playClick();
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    setAppState('loading');
    
    // Fake Loading Simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setAppState('game');
        }, 500);
      }
      setLoadingProgress(progress);
    }, 200);
  };

  // Initialize World (Run once on mount, but reused when game starts)
  useEffect(() => {
    const newMap = Array(WORLD_HEIGHT).fill(0).map(() => Array(WORLD_WIDTH).fill(0));
    
    // Terrain Generation
    for (let x = 0; x < WORLD_WIDTH; x++) {
      // Simple terrain height using sine waves
      const height = Math.floor(
        WORLD_HEIGHT / 2 + 
        Math.sin(x * 0.1) * 5 + 
        Math.sin(x * 0.05) * 10
      );
      
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        if (y > height) {
            newMap[y][x] = BLOCKS.STONE;
        } else if (y === height) {
            newMap[y][x] = BLOCKS.GRASS;
        } else if (y > height - 3 && y < height) {
             newMap[y][x] = BLOCKS.DIRT;
        }
      }

      // Add Trees
      if (x > 5 && x < WORLD_WIDTH - 5 && Math.random() < 0.05) {
          const groundY = height; // Height is the grass block index
          // Trunk
          for (let i = 1; i <= 4; i++) {
              if (groundY - i >= 0) newMap[groundY - i][x] = BLOCKS.WOOD;
          }
          // Leaves
          for (let lx = x - 2; lx <= x + 2; lx++) {
              for (let ly = groundY - 6; ly <= groundY - 4; ly++) {
                  if (ly >= 0 && lx >= 0 && lx < WORLD_WIDTH) {
                      if (Math.random() > 0.2) newMap[ly][lx] = BLOCKS.LEAVES;
                  }
              }
          }
      }
    }
    
    mapRef.current = newMap;
    playerRef.current.y = (WORLD_HEIGHT / 2 - 20) * BLOCK_SIZE;
  }, []);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game Loop
  const update = () => {
    if (appState !== 'game') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const player = playerRef.current;
    const map = mapRef.current;

    // --- Physics ---
    if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) player.vx = PLAYER_SPEED;
    else if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) player.vx = -PLAYER_SPEED;
    else player.vx = 0;

    if ((keysRef.current['Space'] || keysRef.current['ArrowUp']) && player.grounded) {
        player.vy = JUMP_FORCE;
        player.grounded = false;
    }

    player.vy += GRAVITY;
    if (player.vy > TERMINAL_VELOCITY) player.vy = TERMINAL_VELOCITY;

    // Collision Detection (X Axis)
    player.x += player.vx;
    checkCollision(player, map, true);

    // Collision Detection (Y Axis)
    player.y += player.vy;
    player.grounded = false;
    checkCollision(player, map, false);

    // World Bounds
    if (player.x < 0) player.x = 0;
    if (player.x > WORLD_WIDTH * BLOCK_SIZE - player.width) player.x = WORLD_WIDTH * BLOCK_SIZE - player.width;
    if (player.y > WORLD_HEIGHT * BLOCK_SIZE) {
        // Void reset
        player.y = 0;
        player.vy = 0;
    }

    // --- Camera ---
    cameraRef.current.x = player.x - canvas.width / 2 + player.width / 2;
    cameraRef.current.y = player.y - canvas.height / 2 + player.height / 2;

    // Clamp Camera
    if (cameraRef.current.x < 0) cameraRef.current.x = 0;
    if (cameraRef.current.x > WORLD_WIDTH * BLOCK_SIZE - canvas.width) cameraRef.current.x = WORLD_WIDTH * BLOCK_SIZE - canvas.width;
    if (cameraRef.current.y < 0) cameraRef.current.y = 0;
    if (cameraRef.current.y > WORLD_HEIGHT * BLOCK_SIZE - canvas.height) cameraRef.current.y = WORLD_HEIGHT * BLOCK_SIZE - canvas.height;

    // --- Rendering ---
    
    // Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F7FA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

    // Draw Blocks (Visible Only Optimization)
    const startCol = Math.floor(cameraRef.current.x / BLOCK_SIZE);
    const endCol = startCol + (canvas.width / BLOCK_SIZE) + 1;
    const startRow = Math.floor(cameraRef.current.y / BLOCK_SIZE);
    const endRow = startRow + (canvas.height / BLOCK_SIZE) + 1;

    for (let y = startRow; y <= endRow; y++) {
        if (y < 0 || y >= WORLD_HEIGHT) continue;
        for (let x = startCol; x <= endCol; x++) {
            if (x < 0 || x >= WORLD_WIDTH) continue;
            
            const block = map[y][x];
            if (block !== BLOCKS.AIR) {
                ctx.fillStyle = BLOCK_COLORS[block] || 'pink';
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                
                // Grass Top Texture
                if (block === BLOCKS.GRASS) {
                    ctx.fillStyle = '#32CD32';
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, 6);
                }
            }
        }
    }

    // Draw Player
    // Legs
    ctx.fillStyle = selectedSkin.legs;
    ctx.fillRect(player.x + 4, player.y + 36, 5, 20); // Left leg
    ctx.fillRect(player.x + 11, player.y + 36, 5, 20); // Right leg
    
    // Body
    ctx.fillStyle = selectedSkin.bodyColor;
    ctx.fillRect(player.x, player.y + 16, player.width, 20);
    
    // Head
    ctx.fillStyle = selectedSkin.headColor;
    ctx.fillRect(player.x + 2, player.y, 16, 16);
    
    // Eyes (Direction based)
    ctx.fillStyle = selectedSkin.id === 'enderman' ? '#d946ef' : (selectedSkin.id === 'creeper' ? 'black' : 'white'); // Sclera
    if (selectedSkin.id !== 'creeper') {
        const eyeX = player.vx >= 0 ? player.x + 12 : player.x + 4;
        ctx.fillRect(eyeX, player.y + 6, 4, 2);
        
        ctx.fillStyle = selectedSkin.id === 'enderman' ? '#d946ef' : 'black'; // Pupil
        ctx.fillRect(eyeX + (player.vx >= 0 ? 1 : 0), player.y + 6, 2, 2);
    } else {
        // Creeper face
        ctx.fillRect(player.x + 5, player.y + 4, 3, 3);
        ctx.fillRect(player.x + 12, player.y + 4, 3, 3);
        ctx.fillRect(player.x + 8, player.y + 8, 4, 4);
    }


    // Name Tag
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    const textWidth = ctx.measureText(username).width;
    ctx.fillRect(player.x + player.width/2 - textWidth/2 - 4, player.y - 25, textWidth + 8, 18);
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(username, player.x + player.width/2, player.y - 12);
    ctx.textAlign = 'start'; // Reset

    ctx.restore();
    
    animationFrameRef.current = requestAnimationFrame(update);
  };

  const checkCollision = (p: any, map: number[][], isX: boolean) => {
      const startX = Math.floor(p.x / BLOCK_SIZE);
      const endX = Math.floor((p.x + p.width - 0.01) / BLOCK_SIZE);
      const startY = Math.floor(p.y / BLOCK_SIZE);
      const endY = Math.floor((p.y + p.height - 0.01) / BLOCK_SIZE);

      for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
              if (y >= 0 && y < WORLD_HEIGHT && x >= 0 && x < WORLD_WIDTH) {
                  if (map[y][x] !== BLOCKS.AIR) {
                      if (isX) {
                          if (p.vx > 0) p.x = x * BLOCK_SIZE - p.width;
                          else if (p.vx < 0) p.x = (x + 1) * BLOCK_SIZE;
                          p.vx = 0;
                      } else {
                          if (p.vy > 0) {
                              p.y = y * BLOCK_SIZE - p.height;
                              p.grounded = true;
                          } else if (p.vy < 0) {
                              p.y = (y + 1) * BLOCK_SIZE;
                          }
                          p.vy = 0;
                      }
                      return;
                  }
              }
          }
      }
  };

  useEffect(() => {
    if (appState === 'game') {
      animationFrameRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [appState]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left + cameraRef.current.x;
    const clickY = e.clientY - rect.top + cameraRef.current.y;

    const gridX = Math.floor(clickX / BLOCK_SIZE);
    const gridY = Math.floor(clickY / BLOCK_SIZE);

    if (gridX < 0 || gridX >= WORLD_WIDTH || gridY < 0 || gridY >= WORLD_HEIGHT) return;

    // Distance check
    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
    const dist = Math.hypot(clickX - playerCenterX, clickY - playerCenterY);
    
    if (dist > 150) return; // Reach distance

    const map = mapRef.current;

    if (e.button === 0) { // Left Click: Break
        map[gridY][gridX] = BLOCKS.AIR;
    } else if (e.button === 2) { // Right Click: Place
        // Don't place inside player
        const p = playerRef.current;
        const blockRect = { x: gridX * BLOCK_SIZE, y: gridY * BLOCK_SIZE, w: BLOCK_SIZE, h: BLOCK_SIZE };
        if (
            p.x < blockRect.x + blockRect.w &&
            p.x + p.width > blockRect.x &&
            p.y < blockRect.y + blockRect.h &&
            p.y + p.height > blockRect.y
        ) {
            return; // Overlaps player
        }
        
        if (map[gridY][gridX] === BLOCKS.AIR) {
             map[gridY][gridX] = selectedBlock;
        }
    }
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col h-full bg-gray-800 relative">
      
      {/* LAUNCHER SCREEN */}
      {appState !== 'game' && (
        <div className="absolute inset-0 z-50 bg-[#2c2e33] flex flex-col">
          {/* Launcher Header */}
          <div className="h-12 bg-[#212327] flex items-center px-6 text-gray-400 text-sm gap-6 border-b border-black/20">
            <span className="text-white font-bold cursor-pointer hover:text-gray-200" onClick={() => setLauncherTab('play')}>MinesraftLauncher</span>
            <button 
                onClick={() => setLauncherTab('play')}
                className={`cursor-pointer hover:text-white h-full flex items-center border-b-2 ${launcherTab === 'play' ? 'border-white text-white' : 'border-transparent'}`}
            >
                Play
            </button>
            <button 
                onClick={() => setLauncherTab('skins')}
                className={`cursor-pointer hover:text-white h-full flex items-center border-b-2 ${launcherTab === 'skins' ? 'border-white text-white' : 'border-transparent'}`}
            >
                Skins
            </button>
            <span className="cursor-pointer hover:text-white">Patch Notes</span>
          </div>

          {/* Launcher Main Body */}
          <div className="flex-1 relative overflow-hidden">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-40"
              alt="Minecraft Background"
            />
            
            {launcherTab === 'play' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg font-mono">MinesraftLauncher</h1>
                
                <div className="bg-[#212327]/90 p-8 rounded-lg shadow-2xl border border-gray-600 w-96 backdrop-blur-sm">
                    <div className="mb-6">
                        <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Username</label>
                        <div className="flex items-center bg-black/30 border border-gray-600 rounded focus-within:border-green-500 transition-colors px-3 py-2">
                        <User size={18} className="text-gray-500 mr-2" />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
                            placeholder="Player Name"
                        />
                        </div>
                    </div>

                    <div className="mb-6 flex items-center gap-3 p-2 bg-black/20 rounded">
                        <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center border border-gray-500 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center relative">
                                <div style={{ backgroundColor: selectedSkin.headColor }} className="w-4 h-4 absolute top-1 left-2 z-10 rounded-sm"></div>
                                <div style={{ backgroundColor: selectedSkin.bodyColor }} className="w-6 h-6 absolute top-4 left-1 rounded-t-sm"></div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xs text-gray-400">Current Skin</div>
                            <div className="text-sm text-white font-bold truncate">{selectedSkin.name}</div>
                        </div>
                        <button onClick={() => setLauncherTab('skins')} className="text-xs text-green-400 hover:underline">Change</button>
                    </div>

                    {appState === 'loading' ? (
                        <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white">
                            <span>Downloading assets...</span>
                            <span>{Math.round(loadingProgress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500 transition-all duration-200" 
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <Loader2 className="animate-spin text-green-500" />
                        </div>
                        </div>
                    ) : (
                        <>
                        <div className="mb-6">
                            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Version</label>
                            <div className="relative">
                            <select 
                                value={version} 
                                onChange={(e) => setVersion(e.target.value)}
                                className="w-full bg-black/30 border border-gray-600 text-white py-2 px-3 rounded appearance-none outline-none focus:border-green-500 cursor-pointer"
                            >
                                <option>Release 1.20.4</option>
                                <option>Release 1.19.3</option>
                                <option>Snapshot 24w14a</option>
                                <option>Beta 1.7.3</option>
                                <option>Alpha 1.0.0</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <button 
                            onClick={handlePlayClick}
                            className="w-full bg-[#3a863e] hover:bg-[#2f6d32] text-white font-bold py-4 px-4 rounded shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-lg"
                        >
                            <Play fill="white" size={20} /> Play
                        </button>
                        </>
                    )}
                </div>
                </div>
            )}

            {launcherTab === 'skins' && (
                <div className="absolute inset-0 bg-[#2c2e33]/95 flex flex-col items-center p-8">
                    <h2 className="text-3xl text-white font-bold mb-8 flex items-center gap-3">
                        <Shirt size={32} /> Skin Library
                    </h2>
                    
                    <div className="grid grid-cols-3 gap-6 max-w-3xl w-full">
                        {SKINS.map(skin => (
                            <div 
                                key={skin.id}
                                onClick={() => setSelectedSkin(skin)}
                                className={`
                                    relative bg-[#1e1e1e] rounded-lg p-4 cursor-pointer transition-all border-2
                                    ${selectedSkin.id === skin.id ? 'border-green-500 bg-[#2a2a2a] scale-105 shadow-xl' : 'border-transparent hover:bg-[#252525] hover:border-gray-600'}
                                `}
                            >
                                <div className="h-32 bg-black/20 rounded mb-3 flex items-center justify-center overflow-hidden relative">
                                    {/* Mini Character Preview */}
                                    <div className="relative w-12 h-24 transform scale-150">
                                        {/* Head */}
                                        <div style={{ backgroundColor: skin.headColor }} className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 z-20"></div>
                                        {/* Body */}
                                        <div style={{ backgroundColor: skin.bodyColor }} className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 z-10"></div>
                                        {/* Legs */}
                                        <div style={{ backgroundColor: skin.legs }} className="absolute top-14 left-2 w-3 h-8"></div>
                                        <div style={{ backgroundColor: skin.legs }} className="absolute top-14 right-2 w-3 h-8"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-white font-bold">{skin.name}</div>
                                    {selectedSkin.id === skin.id && (
                                        <div className="text-xs text-green-500 mt-1 font-bold">SELECTED</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => setLauncherTab('play')}
                        className="mt-8 px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition-colors"
                    >
                        Back to Play
                    </button>
                </div>
            )}
          </div>

          {/* Launcher Footer */}
          <div className="h-10 bg-[#212327] flex items-center justify-between px-4 text-gray-500 text-xs border-t border-black/20">
            <span>Ready to play: {version}</span>
            <span>Matdows Launcher v2.5.1</span>
          </div>
        </div>
      )}

      {/* GAME CANVAS */}
      <div className={`flex-1 relative overflow-hidden ${appState !== 'game' ? 'hidden' : ''}`}>
        <canvas 
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-full cursor-crosshair block touch-none"
            onMouseDown={handleCanvasClick}
            onContextMenu={(e) => { e.preventDefault(); handleCanvasClick(e); }}
        />
        
        {/* Controls Hint */}
        <div className="absolute top-2 left-2 text-white/50 text-xs pointer-events-none font-mono z-10">
            <p>Playing as: {username} ({version})</p>
            <p>WASD / Arrows to Move</p>
            <p>Left Click to Mine</p>
            <p>Right Click to Place</p>
        </div>
      </div>

      {/* Inventory / Toolbar (Only in game) */}
      {appState === 'game' && (
        <div className="h-16 bg-gray-900 border-t border-gray-700 flex items-center justify-center gap-2 px-4 z-10">
          {[BLOCKS.DIRT, BLOCKS.GRASS, BLOCKS.STONE, BLOCKS.WOOD, BLOCKS.LEAVES, BLOCKS.BRICK].map(block => (
              <button
                  key={block}
                  onClick={() => setSelectedBlock(block)}
                  className={`
                      w-10 h-10 border-2 transition-all relative flex items-center justify-center
                      ${selectedBlock === block ? 'border-yellow-400 scale-110 z-10' : 'border-gray-600 hover:border-gray-400'}
                  `}
                  style={{ backgroundColor: BLOCK_COLORS[block] }}
              >
                  {block === BLOCKS.GRASS && <div className="absolute top-0 left-0 right-0 h-2 bg-[#32CD32]" />}
              </button>
          ))}
          <div className="w-[1px] h-8 bg-gray-700 mx-2"></div>
          <div className="text-white text-xs font-mono">
              {Object.keys(BLOCKS).find(key => BLOCKS[key as keyof typeof BLOCKS] === selectedBlock)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Minecraft;
