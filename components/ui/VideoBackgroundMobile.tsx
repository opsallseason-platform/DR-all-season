'use client';

import { useEffect, useRef } from 'react';

export function VideoBackgroundMobile({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play on mobile
    video.play().catch(() => {
      // If autoplay blocked, play on first touch
      const playOnTouch = () => {
        video.play();
      };
      document.addEventListener('touchstart', playOnTouch, { once: true });
      document.addEventListener('click', playOnTouch, { once: true });
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
