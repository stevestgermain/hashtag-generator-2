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
      case 'Niche': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Broad': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Related': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Recommended Mix Card (Always Visible) */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 mb-3 shadow-sm relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200/80 text-blue-700">
              <BarChart2 size={14} />
            </span>
            Recommended Mix
          </h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors bg-white/60 hover:bg-white/80 px-3 py-1.5 rounded-lg border border-blue-100/50 shadow-sm"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Mix'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 relative z-10">
          {items.map((item, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 bg-white text-blue-950 text-sm font-medium rounded-lg border border-blue-100 shadow-sm"
            >
              #{item.tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expand/Collapse Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors mb-1 group"
      >
        <span>{isExpanded ? 'Hide Analysis' : 'View Strategy Breakdown'}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Detailed Analysis (Expandable) */}
      {isExpanded && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
           <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-6">Hashtag</div>
              <div className="col-span-3 text-center">Type</div>
              <div className="col-span-3 text-right">Reach</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-gray-50/50 transition-colors">
                  <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                     <span className="flex-shrink-0 w-5 text-gray-300 text-xs font-medium">#{index + 1}</span>
                     <span className="font-medium text-gray-800 text-sm truncate">#{item.tag}</span>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-xs font-medium text-gray-500">
                    {item.reach}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2 items-start text-[10px] text-gray-400 leading-relaxed px-2">
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