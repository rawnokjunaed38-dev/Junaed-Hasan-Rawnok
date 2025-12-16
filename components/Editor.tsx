import React, { useState, useRef } from 'react';
import { Sparkles, Upload, X, Download, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { editImageWithPrompt } from '../services/geminiService';
import { fileToBase64, downloadImage, cn } from '../utils';

export const Editor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setEditedImage(null);
      setError(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = async () => {
    if (!selectedFile || !prompt.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64 = await fileToBase64(selectedFile);
      const result = await editImageWithPrompt(base64, selectedFile.type, prompt);
      setEditedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Ensure your prompt is clear.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <div className="flex flex-col gap-6">
        
        {/* Upload Area */}
        <div className="relative group">
           {!previewUrl ? (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 transition-all hover:border-indigo-500 hover:bg-slate-800/50"
             >
               <div className="mb-4 rounded-full bg-slate-800 p-4 transition-transform group-hover:scale-110">
                 <Upload className="h-8 w-8 text-indigo-400" />
               </div>
               <p className="text-lg font-medium text-slate-300">Upload an image</p>
               <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
             </div>
           ) : (
             <div className="relative min-h-[300px] w-full overflow-hidden rounded-2xl border border-slate-700 bg-black/20">
               <img src={previewUrl} alt="Original" className="h-full w-full object-contain" />
               <button 
                 onClick={handleClear}
                 className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-red-500/80 transition-colors"
               >
                 <X className="h-5 w-5" />
               </button>
               <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-medium text-white">
                 Original
               </div>
             </div>
           )}
           <input 
             ref={fileInputRef}
             type="file" 
             accept="image/*" 
             className="hidden" 
             onChange={handleFileChange}
           />
        </div>

        {/* Prompt Area */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <label htmlFor="edit-prompt" className="mb-2 block text-sm font-medium text-slate-300">
            How should we change it?
          </label>
          <div className="flex gap-2">
            <input
              id="edit-prompt"
              type="text"
              className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Add a retro filter, remove the background..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={!selectedFile}
            />
          </div>
          <div className="mt-4">
             <Button
                onClick={handleEdit}
                isLoading={isProcessing}
                disabled={!selectedFile || !prompt.trim()}
                className="w-full"
              >
                {!isProcessing && <Sparkles className="mr-2 h-4 w-4" />}
                {isProcessing ? 'Editing...' : 'Apply Edits'}
              </Button>
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
        ) : editedImage ? (
          <div className="group relative h-full w-full overflow-hidden rounded-xl">
            <img
              src={editedImage}
              alt="Edited Result"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button onClick={() => downloadImage(editedImage, `inteli59-edit-${Date.now()}.png`)} variant="secondary" className="rounded-full h-12 w-12 p-0">
                <Download className="h-5 w-5" />
              </Button>
            </div>
             <div className="absolute bottom-4 left-4 rounded-lg bg-indigo-600/90 px-3 py-1 text-xs font-medium text-white shadow-lg">
                 Edited with Gemini
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-slate-500">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <ImageIcon className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-lg font-medium text-slate-400">No edits yet</p>
            <p className="text-sm">Upload an image and describe changes</p>
          </div>
        )}
        
         {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-indigo-400 animate-pulse">Processing your request...</p>
          </div>
        )}
      </div>
    </div>
  );
};
