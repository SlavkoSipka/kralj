import React from 'react';

interface ProcessStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ProcessStep({ icon, title, description }: ProcessStepProps) {
  return (
    <div className="text-center relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 md:p-6 shadow-lg z-10 border border-gray-700">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 md:mb-6">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">{title}</h3>
      <p className="text-sm md:text-base text-gray-300">{description}</p>
    </div>
  );
}