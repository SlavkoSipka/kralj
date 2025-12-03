import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';

interface PriceCardProps {
  title: string;
  price: string;
  duration: string;
  features: string[];
  featured?: boolean;
  onSelect: () => void;
}

export const PriceCard = React.memo(function PriceCard({ title, price, duration, features, featured = false, onSelect }: PriceCardProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div 
      className={`relative rounded-xl p-6 md:p-8 card-hover h-full flex flex-col touch-feedback ${
        featured 
          ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white ring-4 ring-purple-500/30 shadow-2xl md:scale-110 md:-translate-y-4 z-10 sm:transform-none sm:translate-y-0' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl border border-gray-700 sm:transform-none'
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 fade-in">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            {t.mostPopular}
          </span>
        </div>
      )}
      <div className="flex-1">
        <h3 className={`text-lg md:text-xl font-bold mb-4 ${featured ? 'text-white' : ''}`}>{title}</h3>
        <div className={`mb-6 transform transition-transform duration-300 hover:scale-105 ${featured ? 'scale-105' : ''}`}>
          <span className="text-3xl md:text-4xl font-bold">{price}</span>
          <span className="text-sm opacity-75"> / {duration}</span>
        </div>
        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm md:text-base text-gray-200 group">
              <CheckCircle className={`w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0 ${
                featured ? 'text-yellow-300 group-hover:text-yellow-200' : 'group-hover:text-green-400'
              } transition-colors duration-300`} />
              <span className="group-hover:text-white transition-colors duration-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onSelect}
        className={`w-full py-4 px-6 rounded-lg flex items-center justify-center group text-base button-hover relative overflow-hidden touch-feedback ${
          featured
            ? 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
        }`}
      >
        <span className="relative z-10 flex items-center gap-2 transform transition-transform duration-300 group-hover:scale-105">
          {t.choose}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </span>
      </button>
    </div>
  );
});