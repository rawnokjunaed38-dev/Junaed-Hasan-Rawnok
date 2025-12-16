import React, { useState } from 'react';
import { Wand2, Download, AlertCircle, Share2, Maximize2 } from 'lucide-react';
import { Button } from './Button';
import { generateImageFromText } from '../services/geminiService';
import { downloadImage } from '../utils';

export const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateImageFromText(prompt);
      setGeneratedImage(base64Image);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-slate-300">
            Describe your imagination
          </label>
          <textarea
            id="prompt"
            rows={5}
            className="w-full resize-none rounded-xl border border-slate-600 bg-slate-900/50 p-4 text-base text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="A futuristic city floating in the clouds, cyberpunk style, neon lights, 4k render..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Powered by Gemini 2.5 Flash
            </div>
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!prompt.trim()}
              className="w-full sm:w-auto min-w-[140px]"
            >
              {!isGenerating && <Wand2 className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Dreaming...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Tips / Examples */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Inspiration</h3>
           <div className="flex flex-wrap gap-2">
             {['Cyberpunk street', 'Watercolor cat', 'Abstract geometry', 'Retro sci-fi poster'].map((suggestion) => (
               <button
                 key={suggestion}
                 onClick={() => setPrompt(suggestion)}
                 className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-indigo-500 hover:text-white"
               >
                 {suggestion}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="relative flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 p-4 backdrop-blur-sm">
        {error ? (
          <div className="flex max-w-sm flex-col items-center text-center text-red-400">
            <AlertCircle className="mb-3 h-10 w-10" />
            <p className="text-sm">{error}</p>
          </div>
        ) : generatedImage ? (
          <div className="group relative h-full w-full overflow-hidden rounded-xl">
            <img
              src={generatedImage}
              alt="Generated Result"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button onClick={() => downloadImage(generatedImage, `inteli59-${Date.now()}.png`)} variant="secondary" className="rounded-full h-12 w-12 p-0">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-slate-500">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <Wand2 className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-lg font-medium text-slate-400">Ready to create</p>
            <p className="text-sm">Your masterpiece will appear here</p>
          </div>
        )}
        
        {isGenerating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-indigo-400 animate-pulse">Generating your image...</p>
          </div>
        )}
      </div>
    </div>
  );
};
