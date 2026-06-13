/**
 * ABOUT US PAGE
 * Company information, mission, values
 */

'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax effect for text - moves faster than video
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="relative">
      <Header />

      {/* Fixed Video Background for Entire Page */}
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
          <source src="https://tourplatform-bg-videos.sfo3.cdn.digitaloceanspaces.com/bg-about.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Section - Parallax Text */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Text Content */}
        <motion.div 
          className="container mx-auto px-6 text-center text-white max-w-4xl relative z-10"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.p 
            className="text-sm tracking-[0.3em] uppercase mb-6 text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-9xl font-light mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('titleLine1')}
            <br />
            <span className="italic font-semibold">{t('titleLine2')}</span>
          </motion.h1>
          <motion.p 
            className="text-lg text-white/80 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('description')}
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content - All text sections scroll over video */}
      <div className="container mx-auto px-6 py-24 relative z-10">
        {/* Our Story */}
        <StorySection />

        {/* Mission & Values */}
        <ValuesSection />

        {/* Why Choose Us */}
        <WhyChooseSection />

        {/* Stats */}
        <StatsSection />

        {/* CTA Section */}
        <CTASection />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

// Story Section Component
function StorySection() {
  const t = useTranslations('About');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={ref}
      className="max-w-4xl mx-auto mb-32 bg-white/95 backdrop-blur-sm p-12 shadow-2xl rounded-2xl"
      style={{ y, opacity }}
    >
      <motion.p 
        className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {t('ourStory')}
      </motion.p>
      <div className="space-y-6 text-gray-700 text-lg font-light leading-relaxed">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('storyP1')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('storyP2')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t('storyP3')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('storyP4')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t('storyP5')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {t('storyP6')}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Values Section Component
function ValuesSection() {
  const t = useTranslations('About');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);

  return (
    <motion.div 
      ref={ref}
      className="mb-32 bg-white/95 backdrop-blur-sm p-12 shadow-2xl rounded-2xl"
      style={{ y }}
    >
      <motion.p 
        className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {t('whyChooseTitle')}
      </motion.p>
      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {[
          {
            num: "01",
            title: t('missionTitle'),
            text: t('missionText')
          },
          {
            num: "02",
            title: t('sustainabilityTitle'),
            text: t('sustainabilityText')
          },
          {
            num: "03",
            title: t('excellenceTitle'),
            text: t('excellenceText')
          }
        ].map((item, index) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="text-sm font-light text-gray-400 mb-4">{item.num}</div>
            <h3 className="text-2xl font-normal text-gray-900 mb-4">{item.title}</h3>
            <p className="text-gray-600 font-light leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Why Choose Section Component
function WhyChooseSection() {
  const t = useTranslations('About');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);

  const reasons = [
    { title: t('localExpertiseTitle'), text: t('localExpertiseText') },
    { title: t('safetyTitle'), text: t('safetyText') },
    { title: t('pricingTitle'), text: t('pricingText') },
    { title: t('supportTitle'), text: t('supportText') },
    { title: t('smallGroupsTitle'), text: t('smallGroupsText') },
    { title: t('flexibilityTitle'), text: t('flexibilityText') }
  ];

  return (
    <motion.div 
      ref={ref}
      className="mb-32 bg-gray-50/95 backdrop-blur-sm p-12 shadow-2xl rounded-2xl"
      style={{ y }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.p 
          className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t('whyChooseTitle')}
        </motion.p>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {reasons.slice(0, 3).map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="font-normal text-gray-900 mb-2 text-lg">{reason.title}</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">{reason.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="space-y-8">
            {reasons.slice(3).map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="font-normal text-gray-900 mb-2 text-lg">{reason.title}</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">{reason.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Stats Section Component
function StatsSection() {
  const t = useTranslations('About');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  const stats = [
    { value: "12+", label: t('yearsExperience') },
    { value: "10,000+", label: t('happyTravelers') },
    { value: "15+", label: t('toursExcursions') },
    { value: "4.9", label: t('averageRating') }
  ];

  return (
    <motion.div 
      ref={ref}
      className="grid md:grid-cols-4 gap-12 mb-32 max-w-6xl mx-auto bg-white/95 backdrop-blur-sm p-12 shadow-2xl rounded-2xl"
      style={{ y }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <div className="text-4xl font-light text-gray-900 mb-2">{stat.value}</div>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// CTA Section Component
function CTASection() {
  const t = useTranslations('About');
  return (
    <motion.div 
      className="bg-gray-900/95 backdrop-blur-sm text-white py-24 px-12 text-center shadow-2xl rounded-2xl"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-light mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('ctaTitle')}
        </motion.h2>
        <motion.p 
          className="text-lg text-white/70 mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('ctaDescription')}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/tours">
            <Button variant="primary" size="lg" className="bg-white text-gray-900 hover:bg-white/90 font-normal tracking-wide px-12 py-4 rounded-2xl border-none">
              {t('viewExperiences')}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 font-light tracking-wide px-12 py-4 rounded-2xl">
              {t('contactUs')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}