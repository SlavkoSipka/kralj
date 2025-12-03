import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-gray-600 group">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4 md:mb-6 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">{title}</h3>
      <p className="text-sm md:text-base text-gray-300">{description}</p>
    </div>
  );
}