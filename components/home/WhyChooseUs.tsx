/**
 * WHY CHOOSE US SECTION
 * Displays company benefits/features
 */

'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

export function WhyChooseUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const t = useTranslations('WhyChooseUs');
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const benefits = [
    { id: '1', title: t('benefit1Title'), description: t('benefit1Desc') },
    { id: '2', title: t('benefit2Title'), description: t('benefit2Desc') },
    { id: '3', title: t('benefit3Title'), description: t('benefit3Desc') },
    { id: '4', title: t('benefit4Title'), description: t('benefit4Desc') },
  ];

  return (
    <section className="py-24 md:py-32" ref={sectionRef}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="mb-20 max-w-3xl"
          style={{ y, opacity }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-white/70 mb-4">{t('subtitle')}</p>
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-lg text-white/90 font-light leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.id} 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Number indicator */}
              <motion.div 
                className="text-sm font-light text-white/50 mb-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {String(index + 1).padStart(2, '0')}
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-normal text-white mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-white/80 text-sm leading-relaxed font-light">
                {benefit.description}
              </p>
              
              {/* Animated underline on hover */}
              <motion.div
                className="h-px bg-white mt-4"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}