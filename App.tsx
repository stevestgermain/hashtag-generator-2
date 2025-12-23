import React, { useState } from 'react';
import Header from './components/Header';
import ResultCard from './components/ResultCard';
import { generateHashtags } from './services/geminiService';
import { HashtagResult } from './types';
import { Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HashtagResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Platform argument removed
      const data = await generateHashtags(description);
      setResult(data);
    } catch (err) {
      setError("Failed to generate hashtags. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-6 pb-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-[460px] mx-auto">
        
        {/* Signature Header */}
        <Header />

        {/* Main Toolbox Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 p-6">
          
          {/* Text Area */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste your copy or describe your post..."
            className="w-full h-32 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-base p-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none mb-6"
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
            <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 text-center">
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