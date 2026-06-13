/**
 * CTA BANNER SECTION
 * Final call-to-action before footer
 */

'use client';

import { Button } from '@/components/ui/Button';
import {Link} from '@/i18n/routing';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

export function CTABanner() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const t = useTranslations('CTABanner');
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section className="py-32 md:py-40 text-white" ref={sectionRef}>
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <motion.div style={{ y, opacity }}>
        <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-6">
          {t('subtitle')}
        </p>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
          {t('titleLine1')}
          <br />
          <span className="italic font-normal bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            {t('titleLine2')}
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/80 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
          {t('description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-white/90 font-normal tracking-wide px-12 py-4 rounded-none border-none shadow-xl"
              >
                {t('getInTouch')}
              </Button>
            </motion.div>
          </Link>
          <Link href="/tours">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/90 text-white hover:bg-white/10 font-light tracking-wide px-12 py-4 rounded-none backdrop-blur-sm"
              >
                {t('browseExperiences')}
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Contact Info - Minimal */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-white/60 text-sm">
          <motion.a 
            href="tel:+18885998728" 
            className="hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            +1 (888) 599-8728
          </motion.a>
          <span className="hidden sm:block">•</span>
          <motion.a 
            href="mailto:info@drallseasontravel.com" 
            className="hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            info@drallseasontravel.com
          </motion.a>
        </div>
        </motion.div>
      </div>
    </section>
  );
}