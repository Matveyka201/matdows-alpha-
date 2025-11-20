
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppId, WindowState, AppConfig, WifiState, WifiNetwork } from './types';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import ChatApp from './components/apps/ChatApp';
import Explorer from './components/apps/Explorer';
import Settings from './components/apps/Settings';
import Terminal from './components/apps/Terminal';
import GodMode from './components/apps/GodMode';
import Browser from './components/apps/Browser';
import GunShooter from './components/apps/games/GunShooter';
import Parkour from './components/apps/games/Parkour';
import Minecraft from './components/apps/games/Minecraft';
import AiStudio from './components/apps/AiStudio';
import { Bot, FolderOpen, Settings as SettingsIcon, Globe, Terminal as TerminalIcon, Zap, FileText, Crosshair, PlayCircle, Box, ShieldCheck, Code, Music, MessageCircle, Sparkles, Calculator, Calendar, Clock, Palette, CloudSun, Video, Shield, Gamepad, Rocket, Car, Play } from 'lucide-react';
import { playStartup, playWindowOpen, playWindowClose, playMinimize, playMaximize, playError, playClick, playNotification } from './services/soundService';

// --- Simple Placeholder Components for New Apps ---

const VpnApp = () => (
  <div className="h-full bg-gray-900 text-white flex flex-col items-center justify-center p-8">
    <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
      <ShieldCheck size={64} className="text-green-400" />
    </div>
    <h1 className="text-3xl font-bold mb-2">VPN Matvey</h1>
    <p className="text-green-400 font-mono text-lg mb-8">PROTECTION: ACTIVE</p>
    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-xs border border-gray-700">
      <div className="flex justify-between mb-2 text-sm text-gray-400">
        <span>Download Speed</span>
        <span className="text-green-400">∞ Gbps</span>
      </div>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Latency</span>
        <span className="text-green-400">0ms</span>
      </div>
    </div>
    <p className="mt-8 text-gray-500 text-sm">All downloads are now instant.</p>
  </div>
);

const CodeApp = () => (
  <div className="h-full bg-[#1e1e1e] text-gray-300 font-mono flex flex-col">
    <div className="bg-[#2d2d2d] p-2 text-xs flex gap-4">
      <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span>
    </div>
    <div className="flex-1 p-4">
      <p><span className="text-blue-400">import</span> React <span className="text-blue-400">from</span> <span className="text-orange-400">'react'</span>;</p>
      <p className="mt-2"><span className="text-blue-400">const</span> <span className="text-yellow-300">App</span> = () <span className="text-blue-400">=&gt;</span> {'{'}</p>
      <p className="ml-4"><span className="text-green-600">// TODO: Build something amazing</span></p>
      <p className="ml-4"><span className="text-blue-400">return</span> <span className="text-gray-400">&lt;</span><span className="text-green-400">div</span><span className="text-gray-400">&gt;</span>Hello World<span className="text-gray-400">&lt;/</span><span className="text-green-400">div</span><span className="text-gray-400">&gt;</span>;</p>
      <p>{'}'}</p>
    </div>
    <div className="bg-[#007acc] text-white text-xs p-1 flex justify-between px-2">
      <span>main*</span>
      <span>Ln 5, Col 1</span>
    </div>
  </div>
);

const MusicApp = () => (
  <div className="h-full bg-gradient-to-b from-indigo-900 to-black text-white p-6">
    <div className="w-48 h-48 bg-gray-800 rounded-lg mx-auto mb-6 shadow-2xl flex items-center justify-center">
      <Music size={64} className="text-gray-600" />
    </div>
    <h2 className="text-2xl font-bold text-center mb-1">Matdows FM</h2>
    <p className="text-center text-gray-400 mb-8">Best Hits 2024</p>
    <div className="space-y-4">
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-green-500"></div>
      </div>
      <div className="flex justify-center gap-6 text-white">
        <button className="hover:text-green-400">⏮</button>
        <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">▶</button>
        <button className="hover:text-green-400">⏭</button>
      </div>
    </div>
  </div>
);

// --- FUNCTIONAL APPS ---

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');

  const handlePress = (btn: string) => {
      if (display === 'Error') {
          if (['C', 'AC'].includes(btn)) setDisplay('0');
          else if (!['=', '+', '-', '*', '/', '%'].includes(btn)) setDisplay(btn);
          return;
      }

      if (btn === 'C') {
          setDisplay('0');
      } else if (btn === '=') {
          try {
              // Safe-ish eval for a calculator
              // eslint-disable-next-line no-eval
              const result = eval(display);
              if (!isFinite(result) || isNaN(result)) throw new Error();
              setDisplay(String(result).slice(0, 12));
          } catch (e) {
              setDisplay('Error');
          }
      } else {
          setDisplay(prev => prev === '0' ? btn : prev + btn);
      }
  };

  return (
    <div className="h-full bg-gray-200 p-2 flex flex-col">
      <div className="bg-white h-16 mb-2 rounded border border-gray-300 flex items-end justify-end p-2 text-3xl font-mono overflow-hidden whitespace-nowrap">
          {display}
      </div>
      <div className="grid grid-cols-4 gap-1 flex-1">
        {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=', '%'].map(btn => (
           <button key={btn} onClick={() => handlePress(btn)} className={`rounded shadow-sm font-bold text-lg active:bg-gray-300 active:scale-95 transition-transform ${['/','*','-','+','='].includes(btn) ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-white hover:bg-gray-50'}`}>
             {btn}
           </button>
        ))}
      </div>
    </div>
  );
}

const CalendarApp = () => (
  <div className="h-full bg-white flex flex-col">
     <div className="bg-red-600 text-white p-4">
        <h1 className="text-4xl font-light">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h1>
        <h2 className="text-lg opacity-80">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
     </div>
     <div className="grid grid-cols-7 text-center p-2 text-sm text-gray-500 border-b">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
     </div>
     <div className="grid grid-cols-7 text-center flex-1 auto-rows-fr p-2">
        {Array.from({length: 31}, (_, i) => {
            const isToday = i + 1 === new Date().getDate();
            return (
                <div key={i} className={`flex items-center justify-center rounded-full w-8 h-8 mx-auto hover:bg-gray-100 cursor-pointer ${isToday ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}>
                    {i+1}
                </div>
            );
        })}
     </div>
  </div>
);

const PaintApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('black');
    const [isDrawing, setIsDrawing] = useState(false);

    const startDraw = (e: React.MouseEvent) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setIsDrawing(true);
        }
    };
    
    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="bg-white p-2 border-b flex gap-2">
            {['black', 'red', 'blue', 'green', 'yellow', 'purple'].map(c => (
                <div 
                    key={c} 
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border border-gray-300 cursor-pointer ${color === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                    style={{ backgroundColor: c }}
                />
            ))}
            </div>
            <div className="flex-1 p-4 overflow-hidden flex items-center justify-center">
                <canvas 
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="bg-white shadow-lg cursor-crosshair"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                />
            </div>
        </div>
    );
};

const ClockApp = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="text-6xl font-thin font-mono mb-4 tabular-nums">
        {time.toLocaleTimeString([], { hour12: false })}
      </div>
      <div className="text-xl text-gray-400 uppercase tracking-widest mb-12">
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="flex gap-8">
         <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center"><Play size={20} fill="white" /></div>
            <span className="text-xs">Stopwatch</span>
         </div>
         <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"><PlayCircle size={20} /></div>
            <span className="text-xs">Timer</span>
         </div>
      </div>
    </div>
  );
};

const WeatherApp = () => (
  <div className="h-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-6 flex flex-col justify-between">
     <div>
        <h2 className="text-2xl font-light">San Francisco</h2>
        <p className="text-sm opacity-80">Mostly Sunny</p>
     </div>
     <div className="flex flex-col items-center animate-pulse">
        <CloudSun size={80} className="mb-4" />
        <h1 className="text-7xl font-thin">24°</h1>
     </div>
     <div className="flex justify-between text-center bg-white/20 rounded-xl p-4 backdrop-blur-sm">
        <div>
            <span className="text-xs opacity-75">Mon</span>
            <p className="font-bold">22°</p>
        </div>
        <div>
            <span className="text-xs opacity-75">Tue</span>
            <p className="font-bold">25°</p>
        </div>
        <div>
            <span className="text-xs opacity-75">Wed</span>
            <p className="font-bold">24°</p>
        </div>
        <div>
            <span className="text-xs opacity-75">Thu</span>
            <p className="font-bold">21°</p>
        </div>
     </div>
  </div>
);

const MatTubeApp = () => (
    <div className="h-full bg-white flex flex-col">
        <div className="h-12 bg-red-600 flex items-center px-4 text-white gap-2 font-bold">
            <Video /> MatTube
        </div>
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
            <div className="aspect-video bg-black mb-4 rounded-lg flex items-center justify-center text-gray-500 relative group cursor-pointer">
                 <span className="group-hover:text-white transition-colors">Click to Play (Mock)</span>
                 <PlayCircle size={48} className="absolute text-white opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h1 className="text-xl font-bold mb-2">Top 10 Amazing Matdows Features</h1>
            <div className="flex items-center gap-2 mb-4 border-b pb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                    <p className="font-bold text-sm">Tech Daily</p>
                    <p className="text-xs text-gray-500">1.2M subscribers</p>
                </div>
                <button className="ml-auto bg-black text-white px-4 py-2 rounded-full text-sm font-bold">Subscribe</button>
            </div>
            <div className="space-y-2">
                {[1,2,3].map(i => (
                    <div key={i} className="flex gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded">
                        <div className="w-32 h-20 bg-gray-300 rounded"></div>
                        <div>
                            <p className="font-bold text-sm line-clamp-2">Another Recommended Video Title That Is Long</p>
                            <p className="text-xs text-gray-500">Channel Name • 50K views</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AntivirusApp = () => {
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const startScan = () => {
        if (scanning) return;
        setScanning(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setScanning(false);
                    return 100;
                }
                return p + 2;
            });
        }, 50);
    };

    return (
        <div className="h-full bg-slate-800 text-white p-8 flex flex-col items-center justify-center">
            <div className={`w-40 h-40 border-4 ${scanning ? 'border-yellow-400' : 'border-green-500'} rounded-full flex items-center justify-center mb-6 relative transition-colors`}>
                {scanning && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-ping opacity-20"></div>}
                <Shield size={64} className={scanning ? 'text-yellow-400' : 'text-green-500'} />
            </div>
            <h1 className="text-2xl font-bold mb-2">{scanning ? 'Scanning...' : 'System Secure'}</h1>
            <p className={scanning ? 'text-yellow-400' : 'text-green-400 mb-8'}>
                {scanning ? `${progress}% Complete` : 'No threats detected'}
            </p>
            
            {scanning && (
                <div className="w-full bg-slate-900 h-2 rounded-full mb-8 overflow-hidden">
                    <div className="h-full bg-yellow-400 transition-all" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            <div className="w-full bg-slate-700 h-16 rounded-lg flex items-center px-4 justify-between mb-2">
                <span className="font-bold">Quick Scan</span>
                <button onClick={startScan} disabled={scanning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1 rounded transition-colors">Run</button>
            </div>
            <div className="w-full bg-slate-700 h-16 rounded-lg flex items-center px-4 justify-between">
                <span className="font-bold">Real-time Protection</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
        </div>
    );
};

const ChessApp = () => {
    // Simple visualization
    const pieces: {[key: string]: string} = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };
    const board = [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R'],
    ];

    return (
        <div className="h-full bg-[#302e2b] flex items-center justify-center">
            <div className="grid grid-cols-8 border-8 border-[#57534e] rounded-lg overflow-hidden select-none">
                {board.flat().map((piece, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isBlack = (row + col) % 2 === 1;
                    return (
                        <div 
                            key={i} 
                            className={`w-10 h-10 sm:w-12 sm:h-12 ${isBlack ? 'bg-[#769656]' : 'bg-[#eeeed2]'} flex items-center justify-center text-3xl hover:opacity-80 cursor-pointer`}
                        >
                            <span className={piece && 'rnbqkp'.includes(piece) ? 'text-black' : 'text-white drop-shadow-md text-shadow-black'}>
                                {piece ? pieces[piece] : ''}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SpaceShooterApp = () => {
    const [shipX, setShipX] = useState(50);
    const [started, setStarted] = useState(false);

    return (
        <div 
            className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden"
            onMouseMove={(e) => {
                if (!started) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setShipX(Math.max(10, Math.min(90, x)));
            }}
        >
            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2}}></div>
            
            {!started ? (
                <div className="z-10 text-center">
                    <Rocket size={64} className="text-blue-500 mb-4 mx-auto rotate-45" />
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-mono">SPACE COMMANDER</h1>
                    <button 
                        onClick={() => setStarted(true)}
                        className="mt-8 px-6 py-2 border border-blue-500 text-blue-400 rounded hover:bg-blue-500/20 animate-pulse"
                    >
                        INSERT COIN TO START
                    </button>
                </div>
            ) : (
                <>
                     <div className="absolute top-4 right-4 text-white font-mono">SCORE: 0000</div>
                     <Rocket 
                        size={48} 
                        className="absolute bottom-8 text-blue-500 transition-all duration-75" 
                        style={{ left: `${shipX}%`, transform: 'translateX(-50%) rotate(-45deg)' }} 
                    />
                    {/* Mock Enemy */}
                    <div className="absolute top-20 left-1/2 w-12 h-12 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="absolute top-32 left-1/3 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                </>
            )}
        </div>
    );
};

const RacingApp = () => (
    <div className="h-full bg-zinc-900 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 flex justify-center">
             <div className="w-64 h-full bg-zinc-800 relative border-x-8 border-zinc-950">
                {/* Moving Road Lines */}
                <div className="absolute inset-0 flex justify-center gap-16">
                     <div className="w-2 h-full bg-dashed-line animate-road-scroll"></div>
                     <div className="w-2 h-full bg-dashed-line animate-road-scroll"></div>
                </div>
             </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
             <h1 className="text-4xl font-black text-white italic transform -skew-x-12 mb-12 drop-shadow-lg">TURBO RACING</h1>
             
             <div className="relative">
                <Car size={80} className="text-red-600 z-10 relative animate-car-shake" />
                <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/50 blur-md rounded-full"></div>
             </div>

             <button className="mt-12 bg-yellow-500 text-black font-bold px-8 py-3 rounded hover:bg-yellow-400 skew-x-12 border-b-4 border-yellow-700 active:border-0 active:translate-y-1 active:border-t-4 active:border-transparent transition-all">
                DRIVE
             </button>
        </div>
        <style>{`
            .bg-dashed-line {
                background-image: linear-gradient(to bottom, white 50%, transparent 50%);
                background-size: 2px 40px;
            }
            @keyframes road-scroll {
                from { background-position: 0 0; }
                to { background-position: 0 80px; }
            }
            .animate-road-scroll {
                animation: road-scroll 0.5s linear infinite;
            }
            @keyframes car-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-1px); }
                75% { transform: translateX(1px); }
            }
            .animate-car-shake {
                animation: car-shake 0.2s ease-in-out infinite;
            }
        `}</style>
    </div>
);


// App Registry
const APPS: AppConfig[] = [
  { 
    id: AppId.CHAT, 
    title: 'MatAI Assistant', 
    icon: Bot, 
    component: ChatApp,
    defaultSize: { width: 400, height: 600 }
  },
  { 
    id: AppId.EXPLORER, 
    title: 'File Explorer', 
    icon: FolderOpen, 
    component: Explorer,
    defaultSize: { width: 800, height: 500 }
  },
  { 
    id: AppId.BROWSER, 
    title: 'Browser', 
    icon: Globe, 
    component: Browser,
    defaultSize: { width: 900, height: 600 }
  },
  { 
    id: AppId.TERMINAL, 
    title: 'Command Prompt', 
    icon: TerminalIcon, 
    component: Terminal,
    defaultSize: { width: 600, height: 400 }
  },
  { 
    id: AppId.NOTEPAD, 
    title: 'Notepad', 
    icon: FileText, 
    component: () => (
      <textarea className="w-full h-full resize-none p-4 focus:outline-none font-mono text-sm bg-white text-gray-900" placeholder="Type something..." />
    ),
    defaultSize: { width: 500, height: 400 }
  },
  { 
    id: AppId.SETTINGS, 
    title: 'Settings', 
    icon: SettingsIcon, 
    component: Settings, 
    defaultSize: { width: 700, height: 500 }
  },
  { 
    id: AppId.GOD_MODE, 
    title: 'God Mode', 
    icon: Zap, 
    component: GodMode, 
    defaultSize: { width: 600, height: 500 },
    hidden: true // Hidden from start menu, launched via CMD
  },
  {
    id: AppId.GUN_SHOOTER,
    title: 'Gun Shooter 3D',
    icon: Crosshair,
    component: GunShooter,
    defaultSize: { width: 800, height: 600 },
    hidden: false
  },
  {
    id: AppId.PARKOUR,
    title: 'Parkour 2D',
    icon: PlayCircle,
    component: Parkour,
    defaultSize: { width: 700, height: 400 },
    hidden: false 
  },
  {
    id: AppId.MINECRAFT,
    title: 'MinesraftLauncher',
    icon: Box,
    component: Minecraft,
    defaultSize: { width: 900, height: 600 },
    hidden: false
  },
  {
    id: AppId.AI_STUDIO,
    title: 'MatGen AI',
    icon: Sparkles,
    component: AiStudio,
    defaultSize: { width: 800, height: 600 },
    hidden: false
  },
  // New Apps
  {
    id: AppId.VPN,
    title: 'VPN Matvey',
    icon: ShieldCheck,
    component: VpnApp,
    defaultSize: { width: 400, height: 500 },
    hidden: false
  },
  {
    id: AppId.VSCODE,
    title: 'Code Studio',
    icon: Code,
    component: CodeApp,
    defaultSize: { width: 800, height: 600 },
    hidden: false
  },
  {
    id: AppId.SPOTIFY,
    title: 'MatTunes',
    icon: Music,
    component: MusicApp,
    defaultSize: { width: 400, height: 600 },
    hidden: false
  },
  {
    id: AppId.DISCORD,
    title: 'TalkCord',
    icon: MessageCircle,
    component: () => <div className="h-full flex items-center justify-center text-gray-500">Chat Service Connecting...</div>,
    defaultSize: { width: 900, height: 600 },
    hidden: false
  },
  // --- NEW 10 APPS ---
  {
    id: AppId.CALCULATOR,
    title: 'Calculator',
    icon: Calculator,
    component: CalculatorApp,
    defaultSize: { width: 300, height: 400 },
    hidden: false
  },
  {
    id: AppId.CALENDAR,
    title: 'Calendar',
    icon: Calendar,
    component: CalendarApp,
    defaultSize: { width: 350, height: 450 },
    hidden: false
  },
  {
    id: AppId.PAINT,
    title: 'Paint Pro',
    icon: Palette,
    component: PaintApp,
    defaultSize: { width: 800, height: 600 },
    hidden: false
  },
  {
    id: AppId.WEATHER,
    title: 'Weather',
    icon: CloudSun,
    component: WeatherApp,
    defaultSize: { width: 350, height: 500 },
    hidden: false
  },
  {
    id: AppId.CLOCK,
    title: 'Clock',
    icon: Clock,
    component: ClockApp,
    defaultSize: { width: 400, height: 300 },
    hidden: false
  },
  {
    id: AppId.MATTUBE,
    title: 'MatTube',
    icon: Video,
    component: MatTubeApp,
    defaultSize: { width: 900, height: 600 },
    hidden: false
  },
  {
    id: AppId.ANTIVIRUS,
    title: 'MatDefender',
    icon: Shield,
    component: AntivirusApp,
    defaultSize: { width: 600, height: 400 },
    hidden: false
  },
  {
    id: AppId.CHESS,
    title: 'Chess Master',
    icon: Gamepad,
    component: ChessApp,
    defaultSize: { width: 500, height: 500 },
    hidden: false
  },
  {
    id: AppId.SPACE_SHOOTER,
    title: 'Space Cmdr',
    icon: Rocket,
    component: SpaceShooterApp,
    defaultSize: { width: 800, height: 600 },
    hidden: false
  },
  {
    id: AppId.RACING,
    title: 'Turbo Racing',
    icon: Car,
    component: RacingApp,
    defaultSize: { width: 800, height: 600 },
    hidden: false
  }
];

// Apps installed by default
const DEFAULT_INSTALLED = [
  AppId.CHAT,
  AppId.EXPLORER,
  AppId.BROWSER,
  AppId.TERMINAL,
  AppId.NOTEPAD,
  AppId.SETTINGS,
  AppId.AI_STUDIO
];

const DEFAULT_WALLPAPER = "https://picsum.photos/1920/1080";

// Wifi Configurations
const AVAILABLE_NETWORKS: WifiNetwork[] = [
  { ssid: 'wifi matvey', signal: 4, secured: true, password: '123', speed: 1.0 }, // Fast
  { ssid: 'room wifi', signal: 3, secured: false, speed: 0.5 }, // Medium
  { ssid: 'Neighbor_5G', signal: 1, secured: true, password: 'unknown', speed: 0.1 }
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPER);
  const [isBSOD, setIsBSOD] = useState(false);
  const [installedApps, setInstalledApps] = useState<AppId[]>(DEFAULT_INSTALLED);
  const [hasBooted, setHasBooted] = useState(false);

  // Wifi State
  const [wifi, setWifi] = useState<WifiState>({
    isConnected: false,
    network: null,
    isConnecting: false
  });

  const connectToWifi = (ssid: string, password?: string) => {
    const network = AVAILABLE_NETWORKS.find(n => n.ssid === ssid);
    if (!network) return;

    setWifi(prev => ({ ...prev, isConnecting: true }));

    setTimeout(() => {
      if (network.secured && network.password !== password) {
        playError();
        setWifi(prev => ({ ...prev, isConnecting: false }));
        alert("Incorrect Password");
      } else {
        playNotification();
        setWifi({
          isConnected: true,
          network: network,
          isConnecting: false
        });
      }
    }, 1500); // Fake connection delay
  };

  const disconnectWifi = () => {
    setWifi({ isConnected: false, network: null, isConnecting: false });
  };

  // Try to play startup sound on first user interaction if autoplay blocked
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasBooted) {
        playStartup();
        setHasBooted(true);
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasBooted]);

  const openApp = useCallback((appId: AppId) => {
    setIsStartOpen(false);
    playWindowOpen();
    
    setWindows(prev => {
      const existing = prev.find(w => w.id === appId);
      if (existing) {
        // Bring to front and un-minimize
        setActiveAppId(appId);
        setMaxZIndex(z => z + 1);
        return prev.map(w => w.id === appId ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w);
      }

      const appConfig = APPS.find(a => a.id === appId);
      if (!appConfig) return prev;

      const newWindow: WindowState = {
        id: appId,
        title: appConfig.title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: maxZIndex + 1,
        position: { x: 50 + (prev.length * 30), y: 50 + (prev.length * 30) },
        size: appConfig.defaultSize
      };
      
      setActiveAppId(appId);
      setMaxZIndex(z => z + 1);
      return [...prev, newWindow];
    });
  }, [maxZIndex]);

  const closeApp = (id: AppId) => {
    playWindowClose();
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeAppId === id) setActiveAppId(null);
  };

  const minimizeApp = (id: AppId) => {
    playMinimize();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeAppId === id) setActiveAppId(null);
  };

  const maximizeApp = (id: AppId) => {
    playMaximize();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusApp(id);
  };

  const focusApp = (id: AppId) => {
    setActiveAppId(id);
    setMaxZIndex(z => z + 1);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
  };

  const moveWindow = (id: AppId, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  const toggleStart = () => {
    playClick();
    setIsStartOpen(!isStartOpen);
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsStartOpen(false);
      setActiveAppId(null);
    }
  };

  const installApp = (id: AppId) => {
    setInstalledApps(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const uninstallApp = (id: AppId) => {
    setInstalledApps(prev => prev.filter(appId => appId !== id));
    // Close the app if it's running
    if (windows.some(w => w.id === id)) {
        closeApp(id);
    }
  };
  
  const triggerBSOD = () => {
    playError();
    setIsBSOD(true);
  };

  if (isBSOD) {
    return (
      <div className="w-screen h-screen bg-blue-700 text-white cursor-none flex flex-col items-center justify-center font-mono p-10 select-none z-[99999]">
        <div className="max-w-4xl w-full">
            <div className="text-9xl mb-8">:(</div>
            <h1 className="text-4xl mb-8">Your PC ran into a problem and needs to restart.</h1>
            <p className="text-xl mb-8">We're just collecting some error info, and then we'll restart for you.</p>
            <p className="text-xl mb-16">0% complete</p>
            
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white p-2">
                    {/* Mock QR Code */}
                    <div className="w-full h-full bg-black opacity-80"></div>
                </div>
                <div className="text-sm">
                    <p>For more information about this issue and possible fixes, visit https://matdows.com/stopcode</p>
                    <p className="mt-2">If you call a support person, give them this info:</p>
                    <p>Stop code: CRITICAL_PROCESS_DIED</p>
                </div>
            </div>
            <button 
                onClick={() => setIsBSOD(false)}
                className="mt-12 px-4 py-2 border border-white/20 hover:bg-white/10 rounded text-sm opacity-0 hover:opacity-100 transition-opacity"
            >
                (Click anywhere to Force Reboot)
            </button>
        </div>
      </div>
    );
  }

  // Filter apps: Show if (Not hidden AND Installed) OR (Active Window even if hidden)
  const visibleApps = APPS.filter(app => 
    (!app.hidden && installedApps.includes(app.id))
  );

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={handleDesktopClick}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 pointer-events-none bg-black/10" />

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-4 z-0 flex-wrap h-[90vh] content-start">
        {visibleApps.map(app => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 group w-24 text-white shadow-sm hover:shadow-lg transition-all"
          >
            <app.icon size={40} className="drop-shadow-md text-blue-100 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-center drop-shadow-md line-clamp-2 shadow-black">{app.title}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows.map(windowState => {
        const appConfig = APPS.find(a => a.id === windowState.id);
        if (!appConfig) return null;

        const AppComp = appConfig.component;

        // Pass necessary system functions to specific apps
        const appProps: any = {};
        if (windowState.id === AppId.SETTINGS) {
            appProps.setWallpaper = setWallpaper;
            appProps.wifi = wifi;
            appProps.networks = AVAILABLE_NETWORKS;
            appProps.connectToWifi = connectToWifi;
            appProps.disconnectWifi = disconnectWifi;
            appProps.installedApps = installedApps;
            appProps.onUninstall = uninstallApp;
            appProps.allApps = APPS;
        }
        if (windowState.id === AppId.TERMINAL) {
            appProps.onLaunchApp = openApp;
        }
        if (windowState.id === AppId.GOD_MODE) {
            appProps.setWallpaper = setWallpaper;
            appProps.triggerBSOD = triggerBSOD;
        }
        if (windowState.id === AppId.BROWSER) {
          appProps.installedAppIds = installedApps;
          appProps.onInstallApp = installApp;
          appProps.wifi = wifi;
        }

        return (
          <Window
            key={windowState.id}
            windowState={windowState}
            onClose={() => closeApp(windowState.id)}
            onMinimize={() => minimizeApp(windowState.id)}
            onMaximize={() => maximizeApp(windowState.id)}
            onFocus={() => focusApp(windowState.id)}
            onMove={(x, y) => moveWindow(windowState.id, x, y)}
          >
             <AppComp {...appProps} />
          </Window>
        );
      })}

      {/* UI Shell */}
      <StartMenu 
        apps={visibleApps} 
        isOpen={isStartOpen} 
        onClose={() => setIsStartOpen(false)} 
        onLaunch={openApp} 
      />
      
      <Taskbar 
        apps={visibleApps}
        openApps={windows.map(w => w.id)}
        activeAppId={activeAppId}
        onAppClick={(id) => {
            const win = windows.find(w => w.id === id);
            if (win && win.isMinimized) {
                openApp(id); // Restore logic calls openApp which handles un-minimize and plays sound
            } else if (win && activeAppId === id) {
                minimizeApp(id);
            } else {
                openApp(id);
            }
        }}
        onStartClick={toggleStart}
        isStartOpen={isStartOpen}
        wifi={wifi}
        availableNetworks={AVAILABLE_NETWORKS}
        onConnectWifi={connectToWifi}
        onDisconnectWifi={disconnectWifi}
      />
    </div>
  );
};

export default App;
