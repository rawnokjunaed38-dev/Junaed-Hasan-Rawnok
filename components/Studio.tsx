import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, X, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';
import { generateImageFromText, editImageWithPrompt } from '../services/geminiService';
import { fileToBase64, downloadImage, cn } from '../utils';

export const Studio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when results change
  useEffect(() => {
    if (resultImage || error) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [resultImage, error]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Image too large (max 5MB)");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAction = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      let resultBase64 = '';
      
      if (selectedFile) {
        // Edit Mode
        const base64 = await fileToBase64(selectedFile);
        resultBase64 = await editImageWithPrompt(base64, selectedFile.type, prompt);
      } else {
        // Generate Mode
        resultBase64 = await generateImageFromText(prompt);
      }
      
      setResultImage(resultBase64);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try a different prompt.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Main Canvas / Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="mx-auto max-w-md space-y-6">
          
          {/* Welcome State */}
          {!resultImage && !isProcessing && !error && (
            <div className="mt-20 flex flex-col items-center justify-center text-center opacity-80">
              <div className="mb-6 rounded-3xl p-6">
                <Logo className="h-20 w-auto opacity-80" />
              </div>
              <h2 className="text-xl font-bold text-white">Start Creating</h2>
              <p className="mt-2 max-w-xs text-sm text-slate-400">
                Type a prompt to generate, or <span className="text-cyan-400">upload an image</span> to edit it.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Result Card */}
          {resultImage && (
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="relative aspect-square w-full bg-slate-900">
                <img 
                  src={resultImage} 
                  alt="Result" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between p-3 border-t border-slate-700">
                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => downloadImage(resultImage, `i59-${Date.now()}.png`)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" /> Save
                  </Button>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Inteli 59
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isProcessing && (
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
              <div className="flex aspect-square w-full items-center justify-center bg-slate-900">
                 <div className="flex flex-col items-center gap-3">
                   <div className="relative">
                     <Logo className="h-12 w-auto animate-pulse opacity-50" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                     </div>
                   </div>
                   <span className="text-xs text-cyan-400/80 animate-pulse font-medium tracking-wide">
                     {selectedFile ? 'EDITING...' : 'GENERATING...'}
                   </span>
                 </div>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-3 pb-6 sm:pb-4 safe-bottom z-40">
        <div className="mx-auto max-w-md">
          
          {/* Attachment Preview (if any) */}
          {previewUrl && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-800 p-2 border border-slate-700 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg bg-black">
                   <img src={previewUrl} alt="Upload" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-medium text-white">Image attached</span>
                   <span className="text-[10px] text-slate-400">Ready to edit</span>
                </div>
              </div>
              <button 
                onClick={clearAttachment}
                className="rounded-full bg-slate-700 p-1 text-slate-300 hover:bg-slate-600 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-end gap-3">
            
            {/* Upload Button - Prominent */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all border",
                selectedFile 
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-600"
              )}
              aria-label="Upload Image"
            >
              <ImagePlus className="h-6 w-6" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />

            {/* Input Container */}
            <div className="flex-1 flex items-end gap-2 rounded-2xl bg-slate-800 p-2 border border-slate-700 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={selectedFile ? "How should we edit this?" : "Describe an image..."}
                className="max-h-32 w-full resize-none bg-transparent px-2 py-2.5 text-base text-white placeholder-slate-500 focus:outline-none"
                rows={1}
                style={{ height: '44px' }}
              />

              {/* Send Button */}
              <button 
                onClick={handleAction}
                disabled={isProcessing || !prompt.trim()}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all mb-[1px]",
                  prompt.trim() 
                    ? "bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-lg hover:opacity-90 active:scale-95" 
                    : "bg-slate-700/50 text-slate-600 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};