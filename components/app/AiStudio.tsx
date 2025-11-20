import React, { useState } from 'react';
import { Image as ImageIcon, Send, Download, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { generateImage } from '../../services/geminiService';

const AiStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const result = await generateImage(prompt);
      if (result) {
        setImage(result);
      } else {
        setError("Failed to generate image. The service might be busy or the prompt was blocked.");
      }
    } catch (e) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur">
            <div className="flex items-center gap-2">
                <Sparkles className="text-purple-400" size={20} />
                <h1 className="font-bold text-lg tracking-tight">MatGen AI</h1>
            </div>
            <div className="text-xs text-gray-500 px-2 py-1 border border-gray-700 rounded">
                Powered by Imagen 3
            </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#121212] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {loading ? (
                <div className="flex flex-col items-center gap-6 z-10">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={24} className="text-purple-400 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-white font-medium animate-pulse">Dreaming...</p>
                        <p className="text-sm text-gray-500">Generating your masterpiece</p>
                    </div>
                </div>
            ) : image ? (
                <div className="relative group shadow-2xl rounded-lg overflow-hidden max-h-full max-w-full border border-gray-800">
                    <img src={image} alt="Generated" className="max-h-[60vh] object-contain bg-black" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <a href={image} download={`matgen-${Date.now()}.jpg`} className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                            <Download size={24} />
                        </a>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-600 z-10 max-w-md">
                    <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
                        <ImageIcon size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Imagine Anything</h3>
                    <p className="text-sm">Type a description below and let AI generate a unique image for you.</p>
                </div>
            )}

            {error && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2">
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800/80 backdrop-blur-md border-t border-gray-700">
            <div className="flex gap-3 max-w-4xl mx-auto">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                    placeholder="A futuristic city with flying cars, cyberpunk style..."
                    className="flex-1 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm placeholder-gray-500"
                />
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-900/20 active:scale-95"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span className="hidden sm:inline">Generate</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default AiStudio;