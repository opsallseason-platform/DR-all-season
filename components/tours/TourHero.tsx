/**
 * TOUR PAGE HERO - CLEAN VERSION
 * Hero banner with dynamic rotating images (no navigation arrows)
 */

'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function TourHeroClean() {
  const t = useTranslations('Tours');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      {/* Fixed Video Background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="https://tourplatform-bg-videos.sfo3.cdn.digitaloceanspaces.com/tours-bg.mp4?v=mobile-safe-20260613" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Section - Parallax Text */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="container mx-auto px-6 text-center text-white max-w-3xl relative z-10"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.p 
            className="text-sm tracking-[0.3em] uppercase mb-6 text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('subtitle')}
          </motion.p>
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-9xl font-light mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="block">{t('titleLine1')}</span>
            <span className="block overflow-visible">
              <motion.span 
                className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent italic font-semibold inline-block px-4"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                {t('titleLine2')}
              </motion.span>
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg text-white/90 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {t('description')}
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
