import React from 'react';
import { Zap, Skull, Cpu, Monitor, ShieldAlert, RefreshCw } from 'lucide-react';

interface GodModeProps {
  setWallpaper: (url: string) => void;
  triggerBSOD: () => void;
}

const GodMode: React.FC<GodModeProps> = ({ setWallpaper, triggerBSOD }) => {
  const handleMatrixMode = () => {
    setWallpaper('https://media.giphy.com/media/u4410Q96f5G1c7UaHl/giphy.gif?cid=ecf05e4712123123&rid=giphy.gif');
  };

  const handleCyberpunk = () => {
    setWallpaper('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=1920&auto=format&fit=crop');
  };

  const handleOptimize = () => {
    alert("Optimizing Matdows Core... 100% Efficiency Achieved.");
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6 overflow-y-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 uppercase tracking-widest">
          God Mode
        </h1>
        <p className="text-gray-400 text-xs mt-2 uppercase tracking-[0.2em]">Developer Access Granted</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button 
          onClick={handleMatrixMode}
          className="p-4 bg-black/50 border border-green-500/30 rounded-xl hover:bg-green-900/20 hover:border-green-500 transition-all group flex flex-col items-center gap-2"
        >
          <Monitor className="text-green-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-sm font-bold text-green-400">Matrix Mode</span>
        </button>

        <button 
          onClick={handleCyberpunk}
          className="p-4 bg-black/50 border border-blue-500/30 rounded-xl hover:bg-blue-900/20 hover:border-blue-500 transition-all group flex flex-col items-center gap-2"
        >
          <Zap className="text-blue-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-sm font-bold text-blue-400">Cyberpunk City</span>
        </button>

        <button 
          onClick={triggerBSOD}
          className="p-4 bg-black/50 border border-red-500/30 rounded-xl hover:bg-red-900/20 hover:border-red-500 transition-all group flex flex-col items-center gap-2"
        >
          <Skull className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-sm font-bold text-red-500">KILL SYSTEM</span>
        </button>

        <button 
          onClick={handleOptimize}
          className="p-4 bg-black/50 border border-yellow-500/30 rounded-xl hover:bg-yellow-900/20 hover:border-yellow-500 transition-all group flex flex-col items-center gap-2"
        >
          <Cpu className="text-yellow-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-sm font-bold text-yellow-400">Overclock CPU</span>
        </button>

         <button 
          onClick={() => alert("Admin Rights: PERMANENT")}
          className="p-4 bg-black/50 border border-purple-500/30 rounded-xl hover:bg-purple-900/20 hover:border-purple-500 transition-all group flex flex-col items-center gap-2"
        >
          <ShieldAlert className="text-purple-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-sm font-bold text-purple-400">Root Access</span>
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="p-4 bg-black/50 border border-white/30 rounded-xl hover:bg-white/10 hover:border-white transition-all group flex flex-col items-center gap-2"
        >
          <RefreshCw className="text-white group-hover:rotate-180 transition-transform duration-500" size={32} />
          <span className="text-sm font-bold text-white">Reboot OS</span>
        </button>
      </div>

      <div className="mt-8 bg-black/30 p-4 rounded-lg border border-white/10">
        <h3 className="text-xs font-mono text-gray-500 mb-2">SYSTEM LOGS</h3>
        <div className="font-mono text-xs text-green-500 space-y-1 opacity-70">
            <p>{'>'} Access_Token: GOD_8823_XK</p>
            <p>{'>'} Kernel_Integrity: BYPASSED</p>
            <p>{'>'} Reality_Distortion: ENABLED</p>
        </div>
      </div>
    </div>
  );
};

export default GodMode;