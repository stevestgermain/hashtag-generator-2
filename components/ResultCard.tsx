import React, { useState } from 'react';
import { HashtagResult } from '../types';
import { Copy, Check, BarChart2, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ResultCardProps {
  result: HashtagResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const items = result.items;

  const copyToClipboard = () => {
    const text = items.map(t => `#${t.tag}`).join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Niche': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Broad': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Related': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Recommended Mix Card (Always Visible) */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-5 mb-3 shadow-sm relative overflow-hidden transition-colors duration-300">
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
              <BarChart2 size={14} />
            </span>
            Recommended Mix
          </h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg border border-blue-100/50 dark:border-blue-700/50 shadow-sm"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Mix'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 relative z-10">
          {items.map((item, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 text-blue-950 dark:text-blue-100 text-sm font-medium rounded-lg border border-blue-100 dark:border-zinc-700 shadow-sm transition-colors duration-300"
            >
              #{item.tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expand/Collapse Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mb-1 group"
      >
        <span>{isExpanded ? 'Hide Analysis' : 'View Strategy Breakdown'}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Detailed Analysis (Expandable) */}
      {isExpanded && (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 transition-colors">
           <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-700 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Hashtag</div>
              <div className="col-span-3 text-center">Type</div>
              <div className="col-span-3 text-right">Reach</div>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-zinc-700">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-gray-50/50 dark:hover:bg-zinc-700/30 transition-colors">
                  <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                     <span className="flex-shrink-0 w-5 text-gray-300 dark:text-gray-600 text-xs font-medium">#{index + 1}</span>
                     <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">#{item.tag}</span>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    {item.reach}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-700">
                <div className="flex gap-2 items-start text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed px-2">
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    <p>This mix is optimized for maximum organic reach by balancing broad volume tags with specific niche relevance.</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ResultCard;
