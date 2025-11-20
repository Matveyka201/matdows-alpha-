import React, { useState, useRef, useEffect } from 'react';
import { AppId } from '../../types';

interface TerminalProps {
  onLaunchApp: (id: AppId) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onLaunchApp }) => {
  const [history, setHistory] = useState<string[]>([
    'Matdows OS [Version 10.0.25563.1000]',
    '(c) Matdows Corporation. All rights reserved.',
    ''
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `C:\\Users\\Admin> ${cmd}`];

    switch (trimmedCmd) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  help     - Show this list',
          '  ver      - Show OS version',
          '  cls      - Clear screen',
          '  date     - Show current date',
          '  god      - ???',
          '  exit     - Close terminal'
        );
        break;
      case 'ver':
        newHistory.push('Matdows OS [Version 10.0.25563.1000]');
        break;
      case 'cls':
        setHistory([]);
        setInput('');
        return;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'god':
        newHistory.push('INITIATING GOD MODE ACCESS...', 'ACCESS GRANTED.');
        setTimeout(() => {
          onLaunchApp(AppId.GOD_MODE);
        }, 800);
        break;
      case 'exit':
        // In a real OS this closes the window, here we just say bye
        newHistory.push('Session terminated.');
        break;
      case '':
        break;
      default:
        newHistory.push(`'${trimmedCmd}' is not recognized as an internal or external command.`);
    }

    newHistory.push(''); // Empty line for spacing
    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="h-full bg-black text-gray-100 font-mono p-2 text-sm overflow-y-auto select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words leading-tight">{line}</div>
      ))}
      <div className="flex items-center gap-1 pb-4">
        <span>C:\Users\Admin&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-gray-100 focus:ring-0 p-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;