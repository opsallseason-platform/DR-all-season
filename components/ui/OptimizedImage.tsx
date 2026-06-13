'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholderSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
  placeholderSrc = '/images/placeholder.svg'
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(placeholderSrc);
    onError?.();
  };

  // Determine if this is a remote image (from Supabase Storage)
  const isRemoteImage = imageSrc.startsWith('http') && imageSrc.includes('supabase.co');

  // For remote images, we need to handle the Supabase Storage URL structure
  const getImageSrc = () => {
    if (hasError) return placeholderSrc;
    return imageSrc;
  };

  if (fill) {
    return (
      <div className={`relative ${className}`} style={style}>
        {isLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg" />
        )}
        <Image
          src={getImageSrc()}
          alt={alt}
          fill
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          quality={quality}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          unoptimized={!isRemoteImage}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && width && height && (
        <div 
          className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg" 
          style={{ width, height }}
        />
      )}
      <Image
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={!isRemoteImage}
      />
    </div>
  );
}