
import React from 'react';
import { AppConfig, AppId } from '../types';
import { Search, Power } from 'lucide-react';
import { playClick } from '../services/soundService';

interface StartMenuProps {
  apps: AppConfig[];
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (id: AppId) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ apps, isOpen, onClose, onLaunch }) => {
  if (!isOpen) return null;

  const handleLaunch = (id: AppId) => {
    playClick();
    onLaunch(id);
    onClose();
  };

  return (
    <div className="absolute bottom-14 left-4 w-80 sm:w-96 bg-white/80 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/40 p-4 z-[10000] animate-in slide-in-from-bottom-5 duration-200">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Type here to search..." 
          className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Pinned Apps Grid */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-bold text-gray-600">Pinned</span>
          <button className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100">All apps</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {apps.map(app => (
            <button 
              key={app.id}
              onClick={() => handleLaunch(app.id)}
              className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/60 transition-colors group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                 <app.icon size={24} className="text-gray-700" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 truncate w-full text-center">{app.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended / Recent (Mock) */}
      <div className="mb-16">
         <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-bold text-gray-600">Recommended</span>
        </div>
        <div className="space-y-1">
            <div className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">W</div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-800">Project Matdows.docx</span>
                    <span className="text-[10px] text-gray-500">2 hours ago</span>
                </div>
            </div>
             <div className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 text-xs font-bold">AI</div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-800">Chat History</span>
                    <span className="text-[10px] text-gray-500">Yesterday</span>
                </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gray-100/50 border-t border-gray-200/50 rounded-b-xl flex items-center justify-between px-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-sm" />
            <span className="text-sm font-medium text-gray-700">User</span>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
            <Power size={18} />
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
