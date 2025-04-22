"use client";

import { useState } from 'react';
import { useAppContext } from '@/lib/context';

export function Sidebar() {
  const { activeTab, setActiveTab } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className={`bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold">AI Pribadi</h1>
          <p className="text-gray-400 text-sm">Aplikasi AI untuk penggunaan pribadi</p>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li>
              <button
                onClick={() => handleTabChange('chat')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                  activeTab === 'chat'
                    ? 'bg-blue-700'
                    : 'hover:bg-gray-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>Chat</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange('image-generation')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                  activeTab === 'image-generation'
                    ? 'bg-blue-700'
                    : 'hover:bg-gray-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Generasi Gambar</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange('data-analysis')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                  activeTab === 'data-analysis'
                    ? 'bg-blue-700'
                    : 'hover:bg-gray-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Analisis Data</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 bg-gray-900">
          <div className="text-sm text-gray-400">
            <p>Versi 1.0.0</p>
            <p>© 2025 AI Pribadi</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
            <div className="p-4">
              <h1 className="text-2xl font-bold">AI Pribadi</h1>
              <p className="text-gray-400 text-sm">Aplikasi AI untuk penggunaan pribadi</p>
            </div>
            
            <nav className="mt-6">
              <ul>
                <li>
                  <button
                    onClick={() => handleTabChange('chat')}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                      activeTab === 'chat'
                        ? 'bg-blue-700'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <span>Chat</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('image-generation')}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                      activeTab === 'image-generation'
                        ? 'bg-blue-700'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Generasi Gambar</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('data-analysis')}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                      activeTab === 'data-analysis'
                        ? 'bg-blue-700'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Analisis Data</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
