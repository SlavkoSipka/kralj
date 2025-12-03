import React from 'react';
import { Brain } from 'lucide-react';

export function LogoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center transform hover:scale-110 transition-transform duration-500">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Brain className="w-32 h-32 md:w-48 md:h-48 text-blue-400 animate-pulse" />
          <span className="text-6xl md:text-8xl font-bold gradient-text font-display">AiSajt</span>
        </div>
        <a 
          href="/"
          className="inline-block mt-8 text-gray-400 hover:text-white transition-colors duration-300"
        >
          Nazad na početnu
        </a>
      </div>
    </div>
  );
}