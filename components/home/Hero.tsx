/**
 * HERO SECTION
 * Main hero banner with call-to-action
 * 
 * 🖼️ IMAGE REPLACEMENT INSTRUCTIONS:
 * 1. Add your hero image to /public/images/hero-bg.jpg
 * 2. Update the background image below
 * 3. Or keep gradient background and remove bg-image
 */

'use client';

import { Button } from '@/components/ui/Button';
import {Link} from '@/i18n/routing';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

export function Hero() {
  const ref = useRef(null);
  const t = useTranslations('Hero');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <Image
          src="/images/Hero_BG.png"
          alt="Punta Cana excursions and airport transfers - Best tours in Dominican Republic with DR All Season Travel"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Subtle gradient overlay for readability */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 text-center text-white max-w-5xl"
        style={{ opacity }}
      >
        <motion.p 
          className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 text-white/90 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('location')}
        </motion.p>
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-9xl font-light leading-tight mb-8 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t('titleLine1')}
          <br />
          <motion.span 
            className="font-semibold italic bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent inline-block px-2"
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
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed text-white/95"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t('description')}
          <br className="hidden md:block" />
          {t('descriptionLine2')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="relative flex flex-col sm:flex-row gap-4 sm:gap-2 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/tours">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button variant="primary" size="lg" className="bg-white/95 text-gray-900 hover:bg-white font-normal tracking-wide px-8 py-4 rounded-2xl border-none shadow-xl">
                {t('exploreExperiences')}
              </Button>
            </motion.div>
          </Link>
          <div className="relative hidden sm:flex w-0 justify-center pointer-events-none">
            <motion.div
              className="absolute top-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ 
                opacity: { duration: 1, delay: 1.2 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="w-px h-16 bg-white/40"></div>
            </motion.div>
          </div>
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button variant="outline" size="lg" className="border-2 border-white/90 text-white hover:bg-white/10 font-light tracking-wide px-8 py-4 rounded-2xl backdrop-blur-sm">
                {t('planYourJourney')}
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Minimal scroll indicator */}
      <div className="absolute bottom-12 inset-x-0 flex justify-center pointer-events-none sm:hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { duration: 1, delay: 1.2 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-px h-16 bg-white/40"></div>
        </motion.div>
      </div>
    </section>
  );
}