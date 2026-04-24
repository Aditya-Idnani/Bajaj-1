import React, { useState, useEffect } from 'react';
import GraphInput from './components/GraphInput';
import ResultDisplay from './components/ResultDisplay';
import Toast from './components/Toast';
import { Moon, Sun, Combine } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (dataPayload) => {
    setLoading(true);
    setToast({ message: '', type: 'error' });
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process data');
      }
      
      setResult(data);
      showToast('Chart successfully generated', 'success');
    } catch (err) {
      showToast(err.message || 'An error occurred while generating flow', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between pb-8 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full flex-1 flex flex-col items-center p-4 md:p-8 z-10">
        <header className="w-full max-w-7xl flex justify-between items-center mb-10 pt-4 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Combine className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              FlowCraft
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full glass-panel hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 xl:gap-12 mx-auto justify-center">
          <section className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <GraphInput onSubmit={handleSubmit} loading={loading} />
          </section>

          <section className="w-full lg:w-[65%] xl:w-[70%] animate-slide-up flex flex-col" style={{ animationDelay: '0.3s', opacity: 0 }}>
            {result ? (
              <ResultDisplay result={result} />
            ) : (
              <div className="h-full min-h-[500px] glass-panel flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-4">
                <Combine className="w-16 h-16 opacity-20" />
                <p className="font-medium text-lg">Define structures to visualize algorithms</p>
              </div>
            )}
          </section>
        </main>
      </div>
      
      <footer className="w-full text-center mt-12 animate-slide-up z-10" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 tracking-wide">
          Handcrafted by Aditya Idnani
        </p>
      </footer>
      
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />
    </div>
  );
}
