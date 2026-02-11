
import React, { useState, useRef } from 'react';
import { ScanSearch, Upload, Image as ImageIcon, Send, Loader2, Maximize2, RefreshCw } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';

const NexusLens: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail and identify key elements.');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;

    setIsLoading(true);
    try {
      const result = await analyzeImage(selectedImage, prompt);
      setAnalysis(result || "No analysis generated.");
    } catch (error) {
      console.error(error);
      alert("Nexus Lens failed to scan the image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <ScanSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl">Nexus Lens</h2>
            <p className="text-zinc-500 text-xs">Neural Network Visual Perception</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload & Preview */}
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-video w-full rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative ${
                selectedImage ? 'border-amber-500/50 border-solid' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
              }`}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" /> Change Image
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-zinc-700 mb-4" />
                  <h4 className="font-heading font-bold text-zinc-500">Upload Visual Data</h4>
                  <p className="text-zinc-600 text-sm">PNG, JPG or WebP up to 10MB</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Send className="w-4 h-4" /> Analysis Directives
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should the Nexus look for?"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isLoading}
                className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing Visual Vectors...
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    Execute Scan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="flex flex-col">
            <div className="flex-1 glass border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase text-zinc-500">Scan Results</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {analysis ? (
                  <div className="prose prose-invert prose-amber max-w-none">
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {analysis}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center px-8">
                    <ScanSearch className="w-16 h-16 mb-4 opacity-10" />
                    <h5 className="font-heading font-medium">Ready for Scanning</h5>
                    <p className="text-sm mt-2">Upload an image and click Execute Scan to begin visual processing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusLens;
