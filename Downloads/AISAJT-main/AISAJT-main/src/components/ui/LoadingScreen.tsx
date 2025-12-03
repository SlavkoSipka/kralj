import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onLoadComplete }: { onLoadComplete: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onLoadComplete, 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-all duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className={`transition-all duration-700 ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <img
            src="/images/providna2.png"
            alt="AiSajt"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Minimal Loading Indicator */}
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

