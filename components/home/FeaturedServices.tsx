/**
 * FEATURED SERVICES SECTION
 * Displays top 3 tours/excursions
 */

'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import {Link} from '@/i18n/routing';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import { useTranslations } from 'next-intl';

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  image: string;
  featured: boolean;
}

interface FeaturedServicesProps {
  services: ServiceItem[];
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTranslations('FeaturedServices');

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">{t('subtitle')}</p>
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 max-w-3xl">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl font-light leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Link href={`/tours/${service.slug}`} className="group block">
                <motion.div 
                  className="overflow-hidden bg-white shadow-2xl h-full rounded-2xl"
                  whileHover="hover"
                  initial="rest"
                >
                  {/* Service Image */}
                  <div className="relative h-80 w-full overflow-hidden">
                    <motion.div
                      variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      {/* Scan line effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0"
                        variants={{
                          rest: { opacity: 0 },
                          hover: { opacity: 1 }
                        }}
                      >
                        <motion.div
                          className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                          animate={{
                            y: ["-100%", "200%"]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  
                    {/* Category Badge */}
                    <motion.div 
                      className="absolute top-6 left-6 z-10"
                      variants={{
                        rest: { scale: 1, y: 0 },
                        hover: { scale: 1.05, y: -4 }
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs tracking-wider uppercase font-medium shadow-lg">
                        {service.category === 'tour' ? t('tour') : service.category === 'transfer' ? t('transfer') : t('excursion')}
                      </span>
                    </motion.div>
                  </div>

                  {/* Service Info */}
                  <div className="pt-6 px-4 pb-6">
                    <motion.h3 
                      className="text-2xl font-light text-gray-900 mb-3 relative"
                      variants={{
                        rest: { x: 0, color: "#111827" },
                        hover: { x: 6, color: "#2563EB" }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.title}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                        variants={{
                          rest: { width: "0%" },
                          hover: { width: "100%" }
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Details */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-light">
                        {service.duration}
                      </span>
                      <motion.span 
                        className="text-2xl font-light text-gray-900 relative"
                        variants={{
                          rest: { scale: 1, color: "#111827" },
                          hover: { scale: 1.15, color: "#2563EB" }
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        ${service.price}
                        <motion.div
                          className="absolute inset-0 -m-2 bg-blue-500 rounded-full blur-xl"
                          variants={{
                            rest: { opacity: 0 },
                            hover: { opacity: 0.3 }
                          }}
                        />
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/tours">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button variant="outline" size="lg" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-2xl px-12 py-4 font-normal tracking-wide transition-all duration-300">
                {t('allExperiences')}
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}