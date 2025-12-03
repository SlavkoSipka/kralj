import React from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-700 hover:border-gray-600 group scale-hover hover-glow float-animation">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500">
        <div className="transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
      <p className="text-sm md:text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{description}</p>
    </div>
  );
}