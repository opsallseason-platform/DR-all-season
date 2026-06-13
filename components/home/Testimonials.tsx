/**
 * TESTIMONIALS SECTION
 * Customer reviews and ratings
 */

'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { useTranslations } from 'next-intl';

interface Testimonial {
  id: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
  avatar: string;
}

interface TestimonialsProps {
  reviews: Testimonial[];
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const t = useTranslations('Testimonials');
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section className="py-24 md:py-32" ref={sectionRef}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="mb-20 text-center max-w-3xl mx-auto"
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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {reviews.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                scale={1.02}
                transitionSpeed={2500}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor="#ffffff"
                glarePosition="all"
              >
                <motion.div
                  className="bg-white/95 backdrop-blur-sm p-8 md:p-10 group h-full relative overflow-hidden"
                  whileHover={{ 
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Star Rating */}
                  <div className="flex mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-4 h-4 text-gray-900 fill-current"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.15 + i * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ 
                          scale: 1.3, 
                          rotate: 360,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </motion.svg>
                    ))}
                  </div>

                  {/* Comment */}
                  <motion.p 
                    className="text-gray-900 mb-8 leading-relaxed font-light relative z-10"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                  >
                    {testimonial.comment}
                  </motion.p>

                  {/* Customer Info */}
                  <div className="border-t border-gray-200 pt-6 relative z-10">
                    <motion.div
                      className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
                      viewport={{ once: true }}
                    />
                    <motion.p 
                      className="font-normal text-gray-900"
                      initial={{ x: -20, opacity: 0 }}
                      animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
                    >
                      {testimonial.name}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-500 mt-1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.6 }}
                    >
                      {testimonial.country}
                    </motion.p>
                  </div>
                </motion.div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Google Business Profile Review CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/80 mb-6 font-light">
            {t('googleReviewPrompt')}
          </p>
          <a
            href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-normal hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            {t('writeGoogleReview')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}