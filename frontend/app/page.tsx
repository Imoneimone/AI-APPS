"use client";

import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { ImageGeneration } from '@/components/image-generation';
import { DataAnalysis } from '@/components/data-analysis';
import { useAppContext } from '@/lib/context';

export default function Home() {
  const { activeTab } = useAppContext();

  return (
    <main className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {activeTab === 'chat' && 'Chat dengan AI Pribadi'}
            {activeTab === 'image-generation' && 'Generasi Gambar'}
            {activeTab === 'data-analysis' && 'Analisis Data'}
          </h1>
        </header>
        
        <div className="flex-1 overflow-hidden bg-white">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'image-generation' && <ImageGeneration />}
          {activeTab === 'data-analysis' && <DataAnalysis />}
        </div>
      </div>
    </main>
  );
}
