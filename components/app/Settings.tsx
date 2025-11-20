import React, { useState } from 'react';
import { Monitor, Lock, Battery, Wifi, Bluetooth, AlertCircle, AppWindow, Trash2, HardDrive } from 'lucide-react';
import { WifiState, WifiNetwork, AppId, AppConfig } from '../../types';

interface SettingsProps {
  setWallpaper: (url: string) => void;
  wifi: WifiState;
  networks: WifiNetwork[];
  connectToWifi: (ssid: string, password?: string) => void;
  disconnectWifi: () => void;
  installedApps: AppId[];
  onUninstall: (id: AppId) => void;
  allApps: AppConfig[];
}

const Settings: React.FC<SettingsProps> = ({ 
  setWallpaper, wifi, networks, connectToWifi, disconnectWifi,
  installedApps, onUninstall, allApps
}) => {
  const [activeTab, setActiveTab] = useState('display');
  const [passInput, setPassInput] = useState('');
  const [selectedNet, setSelectedNet] = useState<string | null>(null);

  const wallpapers = [
    "https://picsum.photos/1920/1080?random=1",
    "https://picsum.photos/1920/1080?random=2",
    "https://picsum.photos/1920/1080?random=3",
    "https://picsum.photos/1920/1080?random=4"
  ];

  const handleConnect = () => {
      if (selectedNet) {
          connectToWifi(selectedNet, passInput);
          setSelectedNet(null);
          setPassInput('');
      }
  };

  // Format bytes to readable string (mock sizes)
  const getRandomSize = (id: string) => {
    const sizes = ['15 MB', '120 MB', '450 MB', '80 MB', '2 GB', '500 KB'];
    return sizes[id.length % sizes.length];
  };

  return (
    <div className="flex h-full bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="w-16 sm:w-64 bg-white border-r p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-4 px-2 hidden sm:block">Settings</h1>
        
        <button onClick={() => setActiveTab('display')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-left ${activeTab === 'display' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}>
            <Monitor size={20} />
            <span className="hidden sm:block font-medium">Display</span>
        </button>
        <button onClick={() => setActiveTab('network')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-left ${activeTab === 'network' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}>
            <Wifi size={20} />
            <span className="hidden sm:block font-medium">Network</span>
        </button>
        <button onClick={() => setActiveTab('apps')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-left ${activeTab === 'apps' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}>
            <AppWindow size={20} />
            <span className="hidden sm:block font-medium">Apps</span>
        </button>
        <button onClick={() => setActiveTab('security')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-left ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}>
            <Lock size={20} />
            <span className="hidden sm:block font-medium">Security</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {activeTab === 'display' && (
            <>
                <h2 className="text-2xl font-semibold mb-6">Display</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-medium mb-4">Background</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {wallpapers.map((wp, idx) => (
                            <div 
                                key={idx}
                                onClick={() => setWallpaper(wp)}
                                className="aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                            >
                                <img src={wp} alt={`Wallpaper ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}

        {activeTab === 'network' && (
             <>
                <h2 className="text-2xl font-semibold mb-6">Network & Internet</h2>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${wifi.isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                <Wifi size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Wi-Fi</h3>
                                <p className="text-sm text-gray-500">
                                    {wifi.isConnected ? `Connected to ${wifi.network?.ssid}` : 'Not connected'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             {wifi.isConnected && (
                                <button onClick={disconnectWifi} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Disconnect
                                </button>
                             )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-medium mb-4">Available Networks</h3>
                    <div className="space-y-2">
                        {networks.map(net => (
                             <div key={net.ssid} className="border rounded-lg p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Wifi size={20} className={net.signal > 2 ? 'text-gray-800' : 'text-gray-400'} />
                                        <span className="font-medium">{net.ssid}</span>
                                        {net.secured && <Lock size={14} className="text-gray-400" />}
                                    </div>
                                    
                                    {wifi.network?.ssid === net.ssid ? (
                                         <span className="text-sm text-green-600 font-medium">Connected</span>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                if (net.secured) {
                                                    setSelectedNet(net.ssid);
                                                    setPassInput('');
                                                } else {
                                                    connectToWifi(net.ssid);
                                                }
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>

                                {selectedNet === net.ssid && (
                                    <div className="mt-2 flex gap-2">
                                        <input 
                                            type="password" 
                                            className="flex-1 border rounded px-3 py-1 text-sm"
                                            placeholder="Enter security key"
                                            value={passInput}
                                            onChange={(e) => setPassInput(e.target.value)}
                                        />
                                        <button 
                                            onClick={handleConnect}
                                            className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                                        >
                                            Join
                                        </button>
                                        <button 
                                            onClick={() => setSelectedNet(null)}
                                            className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                             </div>
                        ))}
                    </div>
                </div>
             </>
        )}

        {activeTab === 'apps' && (
            <>
                <h2 className="text-2xl font-semibold mb-6">Apps & Features</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <HardDrive size={18} />
                        <span>Storage used: {installedApps.length * 120} MB (Estimated)</span>
                    </div>
                    
                    <div className="space-y-3">
                        {allApps.filter(app => installedApps.includes(app.id)).map(app => {
                            // Prevent uninstalling Settings to avoid getting stuck
                            const isSystemApp = app.id === AppId.SETTINGS;

                            return (
                                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                                            <app.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{app.title}</h3>
                                            <span className="text-xs text-gray-500">{getRandomSize(app.id)}</span>
                                        </div>
                                    </div>

                                    {!isSystemApp && (
                                        <button 
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to uninstall ${app.title}?`)) {
                                                    onUninstall(app.id);
                                                }
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                            <span className="text-sm font-medium">Uninstall</span>
                                        </button>
                                    )}
                                    {isSystemApp && (
                                        <span className="text-xs text-gray-400 italic">System App</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    {installedApps.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No apps installed.
                        </div>
                    )}
                </div>
            </>
        )}

        {activeTab === 'security' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <AlertCircle size={48} className="mb-4" />
                <p>Security module not loaded.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Settings;