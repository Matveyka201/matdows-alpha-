
import React, { useState } from 'react';
import { Globe, Search, Download, Check, Loader2, Gamepad2, WifiOff, AppWindow, ShieldCheck, Zap } from 'lucide-react';
import { AppId, WifiState } from '../../types';

interface BrowserProps {
  installedAppIds: AppId[];
  onInstallApp: (id: AppId) => void;
  wifi: WifiState;
}

const Browser: React.FC<BrowserProps> = ({ installedAppIds, onInstallApp, wifi }) => {
  const [url, setUrl] = useState('https://store.matdows.com/games');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'games' | 'apps'>('games');

  const games = [
    {
      id: AppId.MINECRAFT,
      name: "MinesraftLauncher",
      description: "The official launcher. Download to play Minecraft versions like Beta 1.7.3.",
      image: "https://images.unsplash.com/photo-1607326245042-68e6945e8448?q=80&w=500&auto=format&fit=crop",
      size: "25 MB"
    },
    {
      id: AppId.GUN_SHOOTER,
      name: "Gun Shooter 3D",
      description: "A high-octane 3D target practice simulation. Test your reflexes!",
      image: "https://images.unsplash.com/photo-1595751866979-00083706974d?q=80&w=500&auto=format&fit=crop",
      size: "450 MB"
    },
    {
      id: AppId.PARKOUR,
      name: "Parkour 2D",
      description: "Endless runner platformer. Jump over obstacles and survive.",
      image: "https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=500&auto=format&fit=crop",
      size: "120 MB"
    },
    {
      id: AppId.CHESS,
      name: "Chess Master",
      description: "Classic strategy game. Challenge the AI or play with yourself.",
      image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=500&auto=format&fit=crop",
      size: "45 MB"
    },
    {
      id: AppId.SPACE_SHOOTER,
      name: "Space Commander",
      description: "Defend the galaxy from incoming asteroids and alien ships.",
      image: "https://images.unsplash.com/photo-1614726365202-450c2974248c?q=80&w=500&auto=format&fit=crop",
      size: "210 MB"
    },
    {
      id: AppId.RACING,
      name: "Turbo Racing",
      description: "High speed street racing. Customize your car and win.",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500&auto=format&fit=crop",
      size: "850 MB"
    }
  ];

  const apps = [
    {
      id: AppId.VPN,
      name: "VPN Matvey",
      description: "Ultimate speed booster. Installing this makes all future downloads INSTANT.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop",
      size: "15 MB",
      highlight: true
    },
    {
      id: AppId.VSCODE,
      name: "Code Studio",
      description: "Professional code editor for building the next big thing.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
      size: "80 MB"
    },
    {
      id: AppId.SPOTIFY,
      name: "MatTunes",
      description: "Stream the latest hits directly to your desktop.",
      image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?q=80&w=500&auto=format&fit=crop",
      size: "40 MB"
    },
    {
      id: AppId.DISCORD,
      name: "TalkCord",
      description: "Connect with friends and communities.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&auto=format&fit=crop",
      size: "110 MB"
    },
    {
      id: AppId.CALCULATOR,
      name: "Calculator Plus",
      description: "Advanced scientific calculator for your math needs.",
      image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?q=80&w=500&auto=format&fit=crop",
      size: "5 MB"
    },
    {
      id: AppId.CALENDAR,
      name: "My Calendar",
      description: "Organize your schedule and never miss an event.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=500&auto=format&fit=crop",
      size: "10 MB"
    },
    {
      id: AppId.PAINT,
      name: "Paint Pro",
      description: "Express your creativity with digital art tools.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500&auto=format&fit=crop",
      size: "35 MB"
    },
    {
      id: AppId.WEATHER,
      name: "Weather Now",
      description: "Real-time weather updates and forecasts.",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=500&auto=format&fit=crop",
      size: "12 MB"
    },
    {
      id: AppId.MATTUBE,
      name: "MatTube",
      description: "Watch the world's videos. Streaming entertainment.",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=500&auto=format&fit=crop",
      size: "60 MB"
    },
    {
      id: AppId.CLOCK,
      name: "World Clock",
      description: "Time management, stopwatch and alarms.",
      image: "https://images.unsplash.com/photo-1508057198894-247b986633e5?q=80&w=500&auto=format&fit=crop",
      size: "8 MB"
    },
    {
      id: AppId.ANTIVIRUS,
      name: "MatDefender",
      description: "Protect your Matdows OS from digital threats.",
      image: "https://images.unsplash.com/photo-1563206767-5b1d972d9323?q=80&w=500&auto=format&fit=crop",
      size: "150 MB"
    }
  ];

  const handleInstall = (id: AppId) => {
    if (installedAppIds.includes(id)) return;

    if (!wifi.isConnected) {
        setError("No Internet Connection");
        setTimeout(() => setError(null), 2000);
        return;
    }
    
    setDownloading(id);
    
    // Check if VPN Matvey is installed
    const isVpnInstalled = installedAppIds.includes(AppId.VPN);

    // Speed Calculation:
    // If VPN is installed: Instant (100ms)
    // Else: Calculate based on Wifi speed
    let downloadTime = 2000;
    if (isVpnInstalled) {
        downloadTime = 100; // Instant
    } else {
        const speedMultiplier = wifi.network ? (1 / wifi.network.speed) : 1;
        downloadTime = 2000 * speedMultiplier;
    }

    setTimeout(() => {
      onInstallApp(id);
      setDownloading(null);
    }, downloadTime);
  };

  const currentItems = activeTab === 'games' ? games : apps;
  const isVpnActive = installedAppIds.includes(AppId.VPN);

  return (
    <div className="flex flex-col h-full bg-white text-gray-800">
      {/* Browser Toolbar */}
      <div className="bg-gray-100 p-2 border-b flex items-center gap-3">
        <div className="flex gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white border rounded-full px-4 py-1.5 text-sm flex items-center gap-2 shadow-sm">
            <Globe size={14} className="text-gray-400" />
            <span className="flex-1 truncate">{url}</span>
            <Search size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b flex px-4 gap-6 text-sm font-medium">
        <button 
            onClick={() => { setActiveTab('games'); setUrl('https://store.matdows.com/games'); }}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'games' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
            <Gamepad2 size={18} />
            Games
        </button>
        <button 
            onClick={() => { setActiveTab('apps'); setUrl('https://store.matdows.com/apps'); }}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'apps' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
            <AppWindow size={18} />
            Apps
        </button>
      </div>

      {/* Web Content (The Store) */}
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
                <WifiOff size={18} />
                {error}
            </div>
        )}

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 transition-colors duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        {activeTab === 'games' ? <Gamepad2 size={32} /> : <AppWindow size={32} />}
                        Matdows Store
                    </h1>
                    <p className="opacity-90">
                        {activeTab === 'games' ? 'Discover the best games for your Matdows OS.' : 'Productivity tools and utilities.'}
                    </p>
                </div>
                {isVpnActive && (
                    <div className="bg-green-500/20 border border-green-400/50 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2">
                        <ShieldCheck className="text-green-300" size={20} />
                        <span className="font-bold text-green-100">VPN Matvey Active</span>
                    </div>
                )}
            </div>
            
            {!wifi.isConnected && (
                <div className="mt-4 bg-white/20 backdrop-blur-sm p-2 rounded flex items-center gap-2 text-sm text-yellow-200">
                    <WifiOff size={16} />
                    You are offline. Connect to Wi-Fi to download.
                </div>
            )}
        </div>

        {/* Content Grid */}
        <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 capitalize">
                Featured {activeTab}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map(item => {
                    const isInstalled = installedAppIds.includes(item.id);
                    const isDownloading = downloading === item.id;

                    return (
                        <div key={item.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border overflow-hidden flex flex-col ${'highlight' in item && item.highlight ? 'ring-2 ring-green-400' : ''}`}>
                            <div className="h-40 overflow-hidden bg-gray-200 relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                {'highlight' in item && item.highlight && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                                        <Zap size={12} /> SPEED BOOST
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{item.size}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 flex-1">{item.description}</p>
                                
                                <button 
                                    onClick={() => handleInstall(item.id)}
                                    disabled={isInstalled || isDownloading}
                                    className={`
                                        w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                                        ${isInstalled 
                                            ? 'bg-green-100 text-green-700 cursor-default' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}
                                        ${isDownloading ? 'opacity-75 cursor-wait' : ''}
                                        ${!wifi.isConnected && !isInstalled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                                    `}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {isVpnActive ? 'Instant Install...' : 'Downloading...'}
                                        </>
                                    ) : isInstalled ? (
                                        <>
                                            <Check size={16} />
                                            Installed
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            {item.id === AppId.MINECRAFT ? 'Download Launcher' : 'Get'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;
