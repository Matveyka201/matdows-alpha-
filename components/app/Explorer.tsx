import React from 'react';
import { Folder, FileText, FileImage, HardDrive, Music, Video } from 'lucide-react';

const files = [
  { name: 'Documents', type: 'folder', icon: Folder, color: 'text-yellow-400' },
  { name: 'Pictures', type: 'folder', icon: Folder, color: 'text-yellow-400' },
  { name: 'Music', type: 'folder', icon: Folder, color: 'text-yellow-400' },
  { name: 'resume.pdf', type: 'file', icon: FileText, color: 'text-red-400' },
  { name: 'vacation.jpg', type: 'file', icon: FileImage, color: 'text-blue-400' },
  { name: 'notes.txt', type: 'file', icon: FileText, color: 'text-gray-400' },
];

const Explorer: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white/95 text-gray-800">
      <div className="bg-gray-100 p-2 border-b flex gap-2 text-sm">
        <button className="px-3 py-1 hover:bg-gray-200 rounded">File</button>
        <button className="px-3 py-1 hover:bg-gray-200 rounded">Home</button>
        <button className="px-3 py-1 hover:bg-gray-200 rounded">View</button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r p-2 hidden sm:block">
           <div className="space-y-1">
             <div className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded cursor-pointer text-sm">
                <HardDrive size={16} className="text-gray-500" />
                <span>This PC</span>
             </div>
             <div className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded cursor-pointer text-sm pl-6">
                <Folder size={16} className="text-yellow-500" />
                <span>Documents</span>
             </div>
             <div className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded cursor-pointer text-sm pl-6">
                <FileImage size={16} className="text-blue-500" />
                <span>Pictures</span>
             </div>
           </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Quick Access</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {files.map((file, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer group">
                <file.icon size={48} className={`${file.color} group-hover:scale-105 transition-transform`} />
                <span className="text-xs text-center truncate w-full">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-6 bg-gray-50 border-t flex items-center px-2 text-xs text-gray-500">
        {files.length} items selected
      </div>
    </div>
  );
};

export default Explorer;