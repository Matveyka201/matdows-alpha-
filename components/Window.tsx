import React, { useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children
}) => {
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (windowState.isMaximized) return;
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y
    };
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      onMove(newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMove]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const style: React.CSSProperties = windowState.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', borderRadius: 0 } // Minus taskbar
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
      };

  return (
    <div
      className="absolute bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden border border-white/20 transition-[width,height,border-radius] duration-200"
      style={{ ...style, zIndex: windowState.zIndex, borderRadius: windowState.isMaximized ? 0 : '0.75rem' }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-gray-100/50 border-b border-gray-200/50 flex items-center justify-between px-3 select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <span className="text-sm font-medium text-gray-700 truncate pointer-events-none">{windowState.title}</span>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-600">
            <Minus size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-600">
            {windowState.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1.5 hover:bg-red-500 hover:text-white rounded-md transition-colors text-gray-600">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Prevent iframe capturing mouse events while dragging */}
        {isDragging.current && <div className="absolute inset-0 z-50 bg-transparent" />} 
        {children}
      </div>
    </div>
  );
};

export default Window;