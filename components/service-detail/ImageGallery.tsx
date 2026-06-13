'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <motion.div 
        className="relative h-[500px] md:h-[600px] w-full overflow-hidden cursor-pointer group rounded-2xl shadow-2xl"
        onClick={() => setIsLightboxOpen(true)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${title} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Zoom indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-white text-sm font-light tracking-wider uppercase bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            View Gallery
          </motion.span>
        </div>

        {/* Image counter badge */}
        <div className="absolute bottom-6 right-6 text-white text-xs font-light tracking-wider bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          {selectedIndex + 1} / {images.length}
        </div>
      </motion.div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative h-28 overflow-hidden transition-all duration-300 rounded-xl ${
              selectedIndex === index
                ? 'ring-2 ring-gray-900 ring-offset-2'
                : 'opacity-60 hover:opacity-100'
            }`}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
            {selectedIndex === index && (
              <div className="absolute inset-0 bg-white/10" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 text-white/70 hover:text-white text-sm font-light tracking-[0.2em] uppercase transition-colors flex items-center gap-3"
            >
              Close
              <span className="text-2xl">x</span>
            </button>

            {/* Navigation - Previous */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(selectedIndex - 1);
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-all flex items-center justify-center text-2xl"
              >
                <span className="sr-only">Previous</span>
                &#8249;
              </button>
            )}
            
            {/* Navigation - Next */}
            {selectedIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(selectedIndex + 1);
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-all flex items-center justify-center text-2xl"
              >
                <span className="sr-only">Next</span>
                &#8250;
              </button>
            )}

            {/* Large Image */}
            <motion.div 
              className="relative max-w-6xl max-h-[85vh] w-full h-full mx-20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[selectedIndex]}
                alt={`${title} full size`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Bottom info bar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
              {/* Thumbnail dots */}
              <div className="flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedIndex === index 
                        ? 'bg-white w-6' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              
              {/* Counter */}
              <span className="text-white/60 text-sm font-light tracking-wider">
                {selectedIndex + 1} of {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
