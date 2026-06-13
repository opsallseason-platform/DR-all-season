'use client';

import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  children?: React.ReactNode;
}

export function VideoBackground({ src, children }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play on mobile devices
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video autoplay prevented:', error);
        // Try again after a short delay
        setTimeout(() => {
          video.play().catch(() => {
            console.log('Video play failed, showing fallback background');
          });
        }, 1000);
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-gray-900">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center' }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
      {children}
    </div>
  );
}
