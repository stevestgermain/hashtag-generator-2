import React from 'react';
import { Hash } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-8">
      {/* Tilted Sticker Icon */}
      <div className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-2xl shadow-lg shadow-blue-600/10 dark:shadow-blue-500/20 mb-5 text-white transform -rotate-6 flex items-center justify-center hover:scale-105 duration-300 transition-transform">
        <Hash size={28} strokeWidth={2.5} />
      </div>
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        Hashtag Generator
      </h1>
      
      {/* Description */}
      <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-[420px] mx-auto font-normal leading-relaxed">
        Instantly generate viral, niche, and trending hashtags optimized for your specific social media platform.
      </p>
    </div>
  );
};

export default Header;
