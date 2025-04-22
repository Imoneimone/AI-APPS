"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useAppContext, Message } from '@/lib/context';
import { analyzeText, analyzeFile, generateForecast } from '@/lib/api';

export function DataAnalysis() {
  const { addMessage, isLoading, setIsLoading, setActiveTab } = useAppContext();
  const [activeTab, setActiveAnalysisTab] = useState<'text' | 'file' | 'forecast'>('text');
  const [textInput, setTextInput] = useState('');
  const [textTask, setTextTask] = useState<'sentiment-analysis' | 'ner' | 'summarization'>('sentiment-analysis');
  const [file, setFile] = useState<File | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState('');
  const [forecastPeriods, setForecastPeriods] = useState(5);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTextAnalysis = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!textInput.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeText(textInput, textTask);
      setAnalysisResult(result);
      
      // Add to chat
      const messageId = Date.now().toString();
      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content: `Analisis teks (${textTask}): "${textInput}"`,
        timestamp: new Date(),
        type: 'text'
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.demoMode 
          ? 'Ini adalah mode demo. Dalam implementasi sebenarnya, teks akan dianalisis sesuai permintaan Anda.'
          : 'Berikut adalah hasil analisis teks Anda.',
        timestamp: new Date(),
        type: 'data',
        data: {
          type: 'text-analysis',
          task: textTask,
          result: result.analysis
        }
      };
      
      addMessage(userMessage);
      addMessage(assistantMessage);
      
      // Switch to chat tab to show the result
      setActiveTab('chat');
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Terjadi kesalahan saat menganalisis teks. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAnalysis = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeFile(file);
      setAnalysisResult(result);
      
      // Add to chat
      const messageId = Date.now().toString();
      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content: `Analisis file: "${file.name}"`,
        timestamp: new Date(),
        type: 'text'
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.demoMode 
          ? 'Ini adalah mode demo. Dalam implementasi sebenarnya, file akan dianalisis sesuai permintaan Anda.'
          : 'Berikut adalah hasil analisis file Anda.',
        timestamp: new Date(),
        type: 'data',
        data: {
          type: 'file-analysis',
          fileName: file.name,
          result: result
        }
      };
      
      addMessage(userMessage);
      addMessage(assistantMessage);
      
      // Switch to chat tab to show the result
      setActiveTab('chat');
    } catch (err) {
      console.error('Error analyzing file:', err);
      setError('Terjadi kesalahan saat menganalisis file. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForecast = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!timeSeriesData.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      // Parse the time series data
      const dataPoints = timeSeriesData
        .split(',')
        .map(point => parseFloat(point.trim()))
        .filter(point => !isNaN(point));
      
      if (dataPoints.length < 3) {
        throw new Error('Minimal 3 titik data diperlukan untuk peramalan.');
      }
      
      const result = await generateForecast(dataPoints, forecastPeriods);
      setAnalysisResult(result);
      
      // Add to chat
      const messageId = Date.now().toString();
      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content: `Peramalan deret waktu dengan ${dataPoints.length} titik data untuk ${forecastPeriods} periode ke depan`,
        timestamp: new Date(),
        type: 'text'
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.demoMode 
          ? 'Ini adalah mode demo. Dalam implementasi sebenarnya, peramalan akan dilakukan berdasarkan data Anda.'
          : 'Berikut adalah hasil peramalan deret waktu Anda.',
        timestamp: new Date(),
        type: 'data',
        data: {
          type: 'forecast',
          inputData: dataPoints,
          forecast: result.forecast,
          periods: forecastPeriods
        }
      };
      
      addMessage(userMessage);
      addMessage(assistantMessage);
      
      // Switch to chat tab to show the result
      setActiveTab('chat');
    } catch (err) {
      console.error('Error generating forecast:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat peramalan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6">Analisis Data</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveAnalysisTab('text')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'text'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              Analisis Teks
            </button>
            <button
              onClick={() => setActiveAnalysisTab('file')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'file'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              Analisis File
            </button>
            <button
              onClick={() => setActiveAnalysisTab('forecast')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'forecast'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              Peramalan
            </button>
          </nav>
        </div>
      </div>
      
      <div className="mb-6">
        {activeTab === 'text' && (
          <form onSubmit={handleTextAnalysis} className="space-y-4">
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                Teks untuk Dianalisis
              </label>
              <textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Masukkan teks yang ingin dianalisis..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="text-task" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Analisis
              </label>
              <select
                id="text-task"
                value={textTask}
                onChange={(e) => setTextTask(e.target.value as any)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="sentiment-analysis">Analisis Sentimen</option>
                <option value="ner">Pengenalan Entitas (NER)</option>
                <option value="summarization">Ringkasan</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading || !textInput.trim()}
            >
              {isLoading ? 'Menganalisis...' : 'Analisis Teks'}
            </button>
          </form>
        )}
        
        {activeTab === 'file' && (
          <form onSubmit={handleFileAnalysis} className="space-y-4">
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
                File untuk Dianalisis
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".csv,.json,.txt,.xlsx"
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Format yang didukung: CSV, JSON, TXT, XLSX (maks. 10MB)
              </p>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading || !file}
            >
              {isLoading ? 'Menganalisis...' : 'Analisis File'}
            </button>
          </form>
        )}
        
        {activeTab === 'forecast' && (
          <form onSubmit={handleForecast} className="space-y-4">
            <div>
              <label htmlFor="time-series-data" className="block text-sm font-medium text-gray-700 mb-1">
                Data Deret Waktu
              </label>
              <textarea
                id="time-series-data"
                value={timeSeriesData}
                onChange={(e) => setTimeSeriesData(e.target.value)}
                placeholder="Masukkan data deret waktu yang dipisahkan koma, contoh: 10, 20, 15, 30, 25, 40"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Masukkan nilai numerik yang dipisahkan koma
              </p>
            </div>
            
            <div>
              <label htmlFor="forecast-periods" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Periode untuk Diramalkan
              </label>
              <input
                id="forecast-periods"
                type="number"
                min="1"
                max="20"
                value={forecastPeriods}
                onChange={(e) => setForecastPeriods(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading || !timeSeriesData.trim()}
            >
              {isLoading ? 'Membuat Peramalan...' : 'Buat Peramalan'}
            </button>
          </form>
        )}
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
          <p className="text-gray-500">
            {activeTab === 'text' ? 'Menganalisis teks...' : 
             activeTab === 'file' ? 'Menganalisis file...' : 
             'Membuat peramalan...'}
          </p>
        </div>
      )}
      
      {!isLoading && analysisResult && (
        <div className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Hasil Analisis</h2>
          
          {activeTab === 'text' && (
            <div>
              <h3 className="text-md font-medium mb-2">
                {textTask === 'sentiment-analysis' ? 'Analisis Sentimen' : 
                 textTask === 'ner' ? 'Entitas Terdeteksi' : 
                 'Ringkasan'}
              </h3>
              
              {analysisResult.demoMode ? (
                <div className="p-3 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-600 italic">Mode Demo: {analysisResult.message}</p>
                  <pre className="mt-2 text-sm overflow-x-auto">
                    {JSON.stringify(analysisResult.analysis, null, 2)}
                  </pre>
                </div>
              ) : (
                <pre className="p-3 bg-gray-100 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(analysisResult.analysis, null, 2)}
                </pre>
              )}
            </div>
          )}
          
          {activeTab === 'file' && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama File</p>
                  <p>{analysisResult.fileName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ukuran File</p>
                  <p>{(analysisResult.fileSize / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipe File</p>
                  <p>{analysisResult.fileType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mode</p>
                  <p>{analysisResult.demoMode ? 'Demo' : 'Produksi'}</p>
                </div>
              </div>
              
              {analysisResult.demoMode && (
                <div className="p-3 bg-gray-100 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic">{analysisResult.message}</p>
                </div>
              )}
              
              <h3 className="text-md font-medium mb-2">Ringkasan</h3>
              <div className="p-3 bg-gray-100 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Jumlah Baris</p>
                    <p>{analysisResult.summary.rowCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Jumlah Kolom</p>
                    <p>{analysisResult.summary.columnCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nilai Kosong</p>
                    <p>{analysisResult.summary.missingValues}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Baris Duplikat</p>
                    <p>{analysisResult.summary.duplicateRows}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-md font-medium mb-2">Statistik</h3>
              <div className="p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium text-gray-500 mb-1">Kolom Numerik</p>
                <p className="mb-2">{analysisResult.statistics.numericColumns.join(', ')}</p>
                
                <p className="text-sm font-medium text-gray-500 mb-1">Kolom Kategorikal</p>
                <p className="mb-2">{analysisResult.statistics.categoricalColumns.join(', ')}</p>
                
                <p className="text-sm font-medium text-gray-500 mb-1">Korelasi</p>
                <ul className="list-disc list-inside">
                  {analysisResult.statistics.correlations.map((corr: any, index: number) => (
                    <li key={index} className="text-sm">
                      {corr.column1} ↔ {corr.column2}: {corr.correlation.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'forecast' && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Jumlah Data Input</p>
                  <p>{analysisResult.inputData.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Periode Peramalan</p>
                  <p>{analysisResult.periods}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mode</p>
                  <p>{analysisResult.demoMode ? 'Demo' : 'Produksi'}</p>
                </div>
              </div>
              
              {analysisResult.demoMode && (
                <div className="p-3 bg-gray-100 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic">{analysisResult.message}</p>
                </div>
              )}
              
              <h3 className="text-md font-medium mb-2">Data Input</h3>
              <div className="p-3 bg-gray-100 rounded-md mb-4 overflow-x-auto">
                <div className="flex space-x-1">
                  {analysisResult.inputData.map((value: number, index: number) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center"
                      style={{ minWidth: '40px' }}
                    >
                      <div 
                        className="bg-blue-500 w-8" 
                        style={{ 
                          height: `${Math.max(20, value * 2)}px`,
                          maxHeight: '100px'
                        }}
                      ></div>
                      <span className="text-xs mt-1">{value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <h3 className="text-md font-medium mb-2">Hasil Peramalan</h3>
              <div className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                <div className="flex space-x-1">
                  {analysisResult.forecast.map((value: number, index: number) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center"
                      style={{ minWidth: '40px' }}
                    >
                      <div 
                        className="bg-green-500 w-8" 
                        style={{ 
                          height: `${Math.max(20, value * 2)}px`,
                          maxHeight: '100px'
                        }}
                      ></div>
                      <span className="text-xs mt-1">{value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
