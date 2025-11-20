import React from 'react';

export enum AppId {
  CHAT = 'chat',
  EXPLORER = 'explorer',
  SETTINGS = 'settings',
  BROWSER = 'browser',
  CALCULATOR = 'calculator',
  NOTEPAD = 'notepad',
  TERMINAL = 'terminal',
  GOD_MODE = 'god_mode',
  GUN_SHOOTER = 'gun_shooter',
  PARKOUR = 'parkour',
  MINECRAFT = 'minecraft',
  VPN = 'vpn',
  VSCODE = 'vscode',
  SPOTIFY = 'spotify',
  DISCORD = 'discord',
  AI_STUDIO = 'ai_studio',
  // New Apps
  CALENDAR = 'calendar',
  CLOCK = 'clock',
  PAINT = 'paint',
  WEATHER = 'weather',
  MATTUBE = 'mattube',
  ANTIVIRUS = 'antivirus',
  CHESS = 'chess',
  SPACE_SHOOTER = 'space_shooter',
  RACING = 'racing'
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppConfig {
  id: AppId;
  title: string;
  icon: React.FC<any>;
  component: React.FC<any>;
  defaultSize: { width: number; height: number };
  hidden?: boolean; // If true, won't show in Start Menu/Desktop but can be launched programmatically
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface WifiNetwork {
  ssid: string;
  signal: number; // 1-4
  secured: boolean;
  password?: string; // The required password
  speed: number; // Multiplier: 1.0 is fast, 0.5 is medium
}

export interface WifiState {
  isConnected: boolean;
  network: WifiNetwork | null;
  isConnecting: boolean;
}