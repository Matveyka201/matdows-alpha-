
import React, { useState, useEffect, useRef } from 'react';
import { AppConfig, AppId, WifiState, WifiNetwork } from '../types';
import { Grip, Wifi, Battery, Volume2, Lock, Loader2, X } from 'lucide-react';
import { playClick } from '../services/soundService';

interface TaskbarProps {
  apps: AppConfig[];
  openApps: AppId[];
  activeAppId: AppId | null;
  onAppClick: (id: AppId) => void;
  onStartClick: () => void;
  isStartOpen: boolean;
  wifi: WifiState;
  availableNetworks: WifiNetwork[];
  onConnectWifi: (ssid: string, password?: string) => void;
  onDisconnectWifi: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  apps, openApps, activeAppId, onAppClick, onStartClick, isStartOpen,
  wifi, availableNetworks, onConnectWifi, onDisconnectWifi
}) => {
  const [time, setTime] = useState(new Date());
  const [isWifiMenuOpen, setIsWifiMenuOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedNetworkSSID, setSelectedNetworkSSID] = useState<string | null>(null);
  const wifiMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close wifi menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wifiMenuRef.current && !wifiMenuRef.current.contains(event.target as Node)) {
        setIsWifiMenuOpen(false);
        setSelectedNetworkSSID(null);
        setPasswordInput('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAppClick = (id: AppId) => {
    playClick();
    onAppClick(id);
  };

  const toggleWifiMenu = () => {
    playClick();
    setIsWifiMenuOpen(!isWifiMenuOpen);
    setSelectedNetworkSSID(null);
    setPasswordInput('');
  };

  const handleNetworkClick = (network: WifiNetwork) => {
    if (wifi.network?.ssid === network.ssid) {
        // Already connected to this one, maybe show disconnect option?
        return;
    }

    if (network.secured) {
        setSelectedNetworkSSID(network.ssid);
        setPasswordInput('');
    } else {
        onConnectWifi(network.ssid);
    }
  };

  const submitPassword = () => {
      if (selectedNetworkSSID) {
          onConnectWifi(selectedNetworkSSID, passwordInput);
          setSelectedNetworkSSID(null);
          setPasswordInput('');
      }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/60 backdrop-blur-2xl border-t border-white/20 flex items-center justify-between px-4 z-[9999] shadow-lg">
      
      {/* Start & Apps */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onStartClick}
          className={`p-2 rounded-md transition-all duration-300 ${isStartOpen ? 'bg-blue-500 text-white shadow-inner' : 'hover:bg-white/50 text-blue-600'}`}
        >
          <Grip size={24} />
        </button>

        <div className="h-8 w-[1px] bg-gray-400/30 mx-2" />

        <div className="flex items-center gap-1">
          {apps.map((app) => {
            const isOpen = openApps.includes(app.id);
            const isActive = activeAppId === app.id;
            
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`
                  relative group p-2 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-white/80 shadow-sm' : 'hover:bg-white/40'}
                `}
              >
                <app.icon 
                    size={22} 
                    className={`transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90 opacity-70'} ${isActive ? '-translate-y-0.5' : ''}`} 
                    color={isActive ? '#2563eb' : '#4b5563'}
                />
                {isOpen && (
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isActive ? 'bg-blue-600 w-4' : 'bg-gray-500'} transition-all duration-300`} />
                )}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {app.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 text-gray-700 text-xs sm:text-sm relative">
        
        {/* WiFi Flyout */}
        {isWifiMenuOpen && (
          <div ref={wifiMenuRef} className="absolute bottom-14 right-0 w-72 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-xl p-4 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200/50">
                <span className="font-semibold text-gray-800">Network Connections</span>
                {wifi.isConnecting && <Loader2 size={16} className="animate-spin text-blue-500" />}
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
                {wifi.isConnected && wifi.network && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-blue-800 font-medium">
                                <Wifi size={18} />
                                <span>{wifi.network.ssid}</span>
                            </div>
                            <span className="text-xs text-blue-600">Connected</span>
                        </div>
                         <button 
                            onClick={onDisconnectWifi}
                            className="w-full py-1 text-xs bg-white border border-blue-200 text-blue-600 rounded hover:bg-blue-100"
                        >
                            Disconnect
                        </button>
                    </div>
                )}

                {availableNetworks.filter(n => n.ssid !== wifi.network?.ssid).map(network => (
                    <div key={network.ssid} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {selectedNetworkSSID === network.ssid ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">{network.ssid}</span>
                                    <button onClick={() => setSelectedNetworkSSID(null)}><X size={14} /></button>
                                </div>
                                <input 
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && submitPassword()}
                                    autoFocus
                                />
                                <button 
                                    onClick={submitPassword}
                                    className="w-full py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500"
                                >
                                    Connect
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => handleNetworkClick(network)}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Wifi size={16} className={network.signal > 2 ? "text-gray-700" : "text-gray-400"} />
                                    <span className="text-sm text-gray-700">{network.ssid}</span>
                                </div>
                                {network.secured && <Lock size={12} className="text-gray-400" />}
                            </button>
                        )}
                    </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 px-2 hover:bg-white/40 rounded transition-colors cursor-pointer py-1" onClick={toggleWifiMenu}>
            <Wifi size={16} className={wifi.isConnected ? "text-blue-600" : "text-gray-500"} />
        </div>
        <div className="hover:bg-white/40 rounded transition-colors cursor-pointer py-1 px-1">
             <Volume2 size={16} />
        </div>
        <div className="hover:bg-white/40 rounded transition-colors cursor-pointer py-1 px-1">
            <Battery size={16} />
        </div>
        
        <div className="text-right ml-2 cursor-default">
          <div className="font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-[10px] text-gray-500 hidden sm:block">{time.toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
