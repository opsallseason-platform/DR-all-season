'use client';

import { useEffect, useRef } from 'react';

type VideoBackgroundMobileProps = {
  src: string;
  hevcSrc?: string;
};

export function VideoBackgroundMobile({ src, hevcSrc }: VideoBackgroundMobileProps) {
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
        webkit-playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        {hevcSrc ? <source src={hevcSrc} type='video/mp4; codecs="hvc1"' /> : null}
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
