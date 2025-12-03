import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';
import { trackPortfolioClick } from '../../utils/analytics';

interface PortfolioCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

export const PortfolioCard = React.memo(function PortfolioCard({ title, description, image, tags, link }: PortfolioCardProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  if (!link) {
    return null;
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPortfolioClick(title, link, language)}
      className="group relative block bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-violet-400 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-2 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
              <span>{t.viewWebsite}</span>
              <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
            <p className="text-white/90 text-sm">{description}</p>
          </div>
        </div>

        {/* Corner Badge */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">
          <ExternalLink className="w-5 h-5 text-violet-600" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors duration-300 flex items-center justify-between">
          {title}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-200 group-hover:from-violet-100 group-hover:to-indigo-100 group-hover:border-violet-300 group-hover:scale-105 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 blur-xl opacity-20"></div>
      </div>
    </a>
  );
});