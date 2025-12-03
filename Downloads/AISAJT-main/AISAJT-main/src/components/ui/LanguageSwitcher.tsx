import React from 'react';
import { Language } from '../../types/language';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onLanguageChange('sr')}
        className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
          language === 'sr'
            ? 'bg-gray-900 text-white scale-110'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        SR
      </button>
      <button
        onClick={() => onLanguageChange('en')}
        className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
          language === 'en'
            ? 'bg-gray-900 text-white scale-110'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}