"use client";

import { useState, FormEvent } from 'react';
import { useAppContext, Message } from '@/lib/context';
import axios from 'axios';

export function ChatInterface() {
  const { messages, addMessage, isLoading, setIsLoading } = useAppContext();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Generate a unique ID for the message
    const messageId = Date.now().toString();
    
    // Add user message to the chat
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };
    
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulasi respons AI sederhana
      // Dalam implementasi sebenarnya, ini akan memanggil API backend
      // yang terhubung ke model AI
      
      // Deteksi jika pesan terkait generasi gambar
      if (input.toLowerCase().includes('gambar') || 
          input.toLowerCase().includes('image') || 
          input.toLowerCase().includes('generate')) {
        
        // Ekstrak prompt dari pesan
        let prompt = input;
        if (input.toLowerCase().includes('gambar dari')) {
          prompt = input.split('gambar dari')[1].trim();
        } else if (input.toLowerCase().includes('generate image of')) {
          prompt = input.split('generate image of')[1].trim();
        }
        
        // Arahkan ke tab generasi gambar
        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Saya akan membantu Anda membuat gambar berdasarkan: "${prompt}". Silakan buka tab Generasi Gambar untuk melanjutkan.`,
            timestamp: new Date(),
            type: 'text'
          };
          
          addMessage(assistantMessage);
          setIsLoading(false);
        }, 1000);
        
        return;
      }
      
      // Deteksi jika pesan terkait analisis data
      if (input.toLowerCase().includes('analisis') || 
          input.toLowerCase().includes('analyze') || 
          input.toLowerCase().includes('data')) {
        
        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Saya akan membantu Anda menganalisis data. Silakan buka tab Analisis Data untuk mengunggah data atau memasukkan teks yang ingin dianalisis.`,
            timestamp: new Date(),
            type: 'text'
          };
          
          addMessage(assistantMessage);
          setIsLoading(false);
        }, 1000);
        
        return;
      }
      
      // Respons umum
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Terima kasih atas pesan Anda: "${input}"\n\nIni adalah aplikasi AI pribadi dengan kemampuan:\n1. Generasi gambar (buka tab Generasi Gambar)\n2. Analisis data (buka tab Analisis Data)\n\nSilakan pilih salah satu tab untuk menggunakan fitur tersebut.`,
          timestamp: new Date(),
          type: 'text'
        };
        
        addMessage(assistantMessage);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.',
        timestamp: new Date(),
        type: 'text'
      };
      
      addMessage(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-bold mb-2">Selamat Datang di AI Pribadi</h2>
              <p>Mulai percakapan dengan mengirim pesan.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg max-w-3xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="font-medium mb-1">
                {message.role === 'user' ? 'Anda' : 'AI Pribadi'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Render image if message has image data */}
              {message.type === 'image' && message.data && message.data.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={message.data.imageUrl} 
                    alt={message.data.prompt || 'Generated image'} 
                    className="max-w-full rounded-md mt-2"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
              
              {/* Render data visualization if message has data */}
              {message.type === 'data' && message.data && (
                <div className="mt-2 p-2 bg-white rounded-md text-sm">
                  <div className="font-medium mb-1">
                    {message.data.type === 'text-analysis' ? 'Hasil Analisis Teks' : 
                     message.data.type === 'file-analysis' ? 'Hasil Analisis File' : 
                     'Hasil Peramalan'}
                  </div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(message.data.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="p-4 rounded-lg bg-gray-200 text-gray-800 max-w-3xl">
            <div className="font-medium mb-1">AI Pribadi</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
