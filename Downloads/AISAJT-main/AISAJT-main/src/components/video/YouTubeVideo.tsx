import { memo } from 'react';

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
}

export const YouTubeVideo = memo(function YouTubeVideo({ 
  videoId, 
  title = 'YouTube video player', 
  className = '' 
}: YouTubeVideoProps) {
  return (
    <div className={`relative w-full pt-[56.25%] overflow-hidden rounded-xl ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
});