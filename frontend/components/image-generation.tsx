"use client";

import { useState, FormEvent } from 'react';
import { useAppContext, Message } from '@/lib/context';
import { generateImage, generateImageWithReplicate, checkReplicateStatus } from '@/lib/api';

export function ImageGeneration() {
  const { addMessage, isLoading, setIsLoading, setActiveTab } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useReplicate, setUseReplicate] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      if (useReplicate) {
        // Use Replicate API
        const result = await generateImageWithReplicate(prompt, negativePrompt);
        
        if (result.demoMode) {
          // Demo mode - show placeholder
          setGeneratedImage('/placeholder-image.jpg');
          
          // Add to chat
          const messageId = Date.now().toString();
          const userMessage: Message = {
            id: messageId,
            role: 'user',
            content: `Generasi gambar: "${prompt}"`,
            timestamp: new Date(),
            type: 'text'
          };
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Ini adalah mode demo. Dalam implementasi sebenarnya, gambar akan dihasilkan berdasarkan prompt Anda.',
            timestamp: new Date(),
            type: 'image',
            data: {
              prompt,
              imageUrl: '/placeholder-image.jpg'
            }
          };
          
          addMessage(userMessage);
          addMessage(assistantMessage);
        } else {
          // Real API mode - handle prediction ID
          setPredictionId(result.predictionId);
          
          // Poll for results
          const checkStatus = async () => {
            const statusResult = await checkReplicateStatus(result.predictionId);
            
            if (statusResult.status === 'succeeded') {
              setGeneratedImage(statusResult.imageUrl);
              
              // Add to chat
              const messageId = Date.now().toString();
              const userMessage: Message = {
                id: messageId,
                role: 'user',
                content: `Generasi gambar: "${prompt}"`,
                timestamp: new Date(),
                type: 'text'
              };
              
              const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Berikut adalah gambar yang dihasilkan berdasarkan prompt Anda.',
                timestamp: new Date(),
                type: 'image',
                data: {
                  prompt,
                  imageUrl: statusResult.imageUrl
                }
              };
              
              addMessage(userMessage);
              addMessage(assistantMessage);
              
              setIsLoading(false);
              
              // Switch to chat tab to show the result
              setActiveTab('chat');
            } else if (statusResult.status === 'failed') {
              setError('Gagal menghasilkan gambar. Silakan coba lagi.');
              setIsLoading(false);
            } else {
              // Still processing, check again in 2 seconds
              setTimeout(checkStatus, 2000);
            }
          };
          
          checkStatus();
          return; // Exit early as we're polling
        }
      } else {
        // Use Hugging Face API
        const result = await generateImage(prompt, negativePrompt);
        
        if (result.demoMode) {
          // Demo mode - show placeholder
          setGeneratedImage('/placeholder-image.jpg');
        } else {
          // Real API mode - show generated image
          setGeneratedImage(result.image);
        }
        
        // Add to chat
        const messageId = Date.now().toString();
        const userMessage: Message = {
          id: messageId,
          role: 'user',
          content: `Generasi gambar: "${prompt}"`,
          timestamp: new Date(),
          type: 'text'
        };
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.demoMode 
            ? 'Ini adalah mode demo. Dalam implementasi sebenarnya, gambar akan dihasilkan berdasarkan prompt Anda.'
            : 'Berikut adalah gambar yang dihasilkan berdasarkan prompt Anda.',
          timestamp: new Date(),
          type: 'image',
          data: {
            prompt,
            imageUrl: result.demoMode ? '/placeholder-image.jpg' : result.image
          }
        };
        
        addMessage(userMessage);
        addMessage(assistantMessage);
        
        // Switch to chat tab to show the result
        setActiveTab('chat');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Terjadi kesalahan saat menghasilkan gambar. Silakan coba lagi.');
      
      // Add error message to chat
      const messageId = Date.now().toString();
      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content: `Generasi gambar: "${prompt}"`,
        timestamp: new Date(),
        type: 'text'
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan saat menghasilkan gambar. Silakan coba lagi dengan prompt yang berbeda.',
        timestamp: new Date(),
        type: 'text'
      };
      
      addMessage(userMessage);
      addMessage(assistantMessage);
    } finally {
      if (!useReplicate || predictionId === null) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6">Generasi Gambar</h1>
      
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan gambar yang ingin Anda hasilkan..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Prompt Negatif (Opsional)
            </label>
            <textarea
              id="negative-prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Jelaskan apa yang tidak ingin Anda lihat dalam gambar..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="use-replicate"
              checked={useReplicate}
              onChange={(e) => setUseReplicate(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="use-replicate" className="ml-2 block text-sm text-gray-700">
              Gunakan Replicate API (alternatif)
            </label>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? 'Menghasilkan...' : 'Hasilkan Gambar'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-gray-500">Menghasilkan gambar...</p>
          {useReplicate && predictionId && (
            <p className="text-sm text-gray-400 mt-2">ID Prediksi: {predictionId}</p>
          )}
        </div>
      )}
      
      {!isLoading && generatedImage && (
        <div className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Hasil Generasi</h2>
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={generatedImage}
              alt={`Gambar yang dihasilkan dari prompt: ${prompt}`}
              className="object-contain w-full h-full"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Prompt: {prompt}</p>
          {negativePrompt && (
            <p className="mt-1 text-sm text-gray-500">Prompt Negatif: {negativePrompt}</p>
          )}
        </div>
      )}
    </div>
  );
}
