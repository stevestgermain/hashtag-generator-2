import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResultCard from './components/ResultCard';
import { generateHashtags } from './services/geminiService';
import { HashtagResult } from './types';
import { Sparkles, Loader2 } from 'lucide-react';
import './index.css';

const App: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HashtagResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Dark mode listener
  useEffect(() => {
    const handleThemeMessage = (event: MessageEvent) => {
      if (event.data?.type === 'THEME_CHANGE') {
        setTheme(event.data.theme);
      }
    };

    window.addEventListener('message', handleThemeMessage);
    
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'REQUEST_THEME' }, '*');
    }

    return () => window.removeEventListener('message', handleThemeMessage);
  }, []);

  // Apply dark class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateHashtags(description);
      setResult(data);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate hashtags. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-6 pb-12 px-4 flex justify-center items-start transition-colors duration-300">
      <div className="w-full max-w-[460px] mx-auto">
        
        {/* Signature Header */}
        <Header />

        {/* Main Toolbox Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-200 dark:border-zinc-800 p-6 transition-colors duration-300">
          
          {/* Text Area */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste your copy or describe your post..."
            className="w-full h-32 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-base p-4 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all resize-none mb-6"
          />

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !description.trim()}
            className={`
              w-full h-12 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all
              ${isLoading || !description.trim() 
                ? 'bg-emerald-600/50 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Hashtags</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-800 text-center break-words transition-colors duration-300">
              {error}
            </div>
          )}

          {/* Results Section */}
          {result && <ResultCard result={result} />}
        </div>
      </div>
    </div>
  );
};

export default App;
