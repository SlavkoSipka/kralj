import React from 'react';
import { useCounter } from '../hooks/useCounter';

interface StatisticCardProps {
  icon: React.ReactNode;
  endValue: number;
  label: string;
  unit?: string;
  delay?: number;
}

const StatisticCard = React.memo<StatisticCardProps>(({
  icon,
  endValue,
  label,
  unit,
  delay = 400
}) => {
  const { count, countRef } = useCounter(endValue);

  return (
    <div 
      className="relative group scroll-animate from-left h-full opacity-0 translate-y-8" 
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div className="relative bg-[#2A2522] h-full p-8 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-12 h-12">
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-gradient-to-b from-[#D4AF37]/20 to-transparent"></div>
          <div className="absolute top-0 left-0 w-8 h-[2px] bg-gradient-to-r from-[#D4AF37]/20 to-transparent"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="inline-block mb-6 transform transition-transform duration-500 group-hover:scale-110">{icon}</div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              ref={countRef}
              className="text-4xl font-serif text-[#D4AF37]" 
              style={{ fontFamily: 'Playfair Display' }}
            >
              {count.toLocaleString()}
            </div>
            {unit && (
              <div 
                className="text-4xl font-serif text-[#D4AF37]"
                style={{ fontFamily: 'Playfair Display' }}
              >
                {unit}
              </div>
            )}
          </div>
          <div className="text-[#D4AF37] text-base">{label}</div>
        </div>
      </div>
    </div>
  );
});

export default StatisticCard;