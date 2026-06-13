/**
 * TOUR CARD COMPONENT
 * Individual tour card for grid display
 */

'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import {Link} from '@/i18n/routing';
import { Service } from '@/types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MouseEvent, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface TourCardProps {
  service: Service;
}

export function TourCard({ service }: TourCardProps) {
  const t = useTranslations('Tours');
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Magnetic hover effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring animation
  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // Rotation based on position
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (-0.5 to 0.5)
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    
    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/tours/${service.slug}`} className="group block h-full">
      <motion.div
        ref={cardRef}
        className="relative overflow-hidden bg-white/20 backdrop-blur-xl border border-white/30 h-full flex flex-col shadow-2xl rounded-2xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover="hover"
        initial="rest"
      >
        {/* Animated glow effect that follows cursor */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent blur-2xl" />
        </motion.div>
        
        {/* Image with reveal mask animation */}
        <div className="relative h-72 w-full overflow-hidden">
          <motion.div
            className="relative w-full h-full"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.1 }
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src={service.image}
              alt={`${service.title} - Punta Cana ${service.category} | Book today and pay on arrival with DR All Season Travel`}
              fill
              className="object-cover"
            />
            
            {/* Gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 0 }
              }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Animated scan line effect */}
            <motion.div
              className="absolute inset-0 opacity-0"
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 0 }
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
          
          {/* Category Badge with liquid morph */}
          <motion.div 
            className="absolute top-6 left-6 z-10"
            variants={{
              rest: { scale: 1, y: 0 },
              hover: { scale: 1.05, y: -4 }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="block px-4 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs tracking-wider uppercase font-medium shadow-lg">
              {service.category}
            </span>
          </motion.div>

          {/* Featured Badge */}
          {service.featured && (
            <motion.div 
              className="absolute top-6 right-6 z-10"
              variants={{
                rest: { scale: 1, y: 0 },
                hover: { scale: 1.05, y: -4 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="block px-4 py-1.5 bg-gray-900 text-white text-xs tracking-wider uppercase font-medium shadow-lg">
                {t('featured')}
              </span>
            </motion.div>
          )}
        </div>

        
        {/* Content with staggered reveal */}
        <motion.div 
          className="p-6 flex-1 flex flex-col relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Title with character reveal */}
          <motion.h3 
            className="text-xl font-normal text-white mb-3 line-clamp-2 relative overflow-hidden"
            variants={{
              rest: {},
              hover: {}
            }}
          >
            <motion.span
              className="block"
              variants={{
                rest: { x: 0, color: "#ffffff" },
                hover: { x: 8, color: "#60A5FA" }
              }}
              transition={{ duration: 0.3 }}
            >
              {service.title}
            </motion.span>
            
            {/* Underline animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
              variants={{
                rest: { width: "0%", x: "0%" },
                hover: { width: "100%", x: "0%" }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.h3>

          
          <motion.p 
            className="text-white/90 text-sm mb-6 line-clamp-3 flex-1 font-light leading-relaxed"
            variants={{
              rest: { opacity: 0.8 },
              hover: { opacity: 1 }
            }}
          >
            {service.description}
          </motion.p>

          {/* Meta Info with split animation */}
          <div className="flex items-center justify-between text-sm border-t border-white/30 pt-4 relative">
            {/* Animated border */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
              variants={{
                rest: { scaleX: 0, originX: 0 },
                hover: { scaleX: 1, originX: 0 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ backgroundSize: "200% 100%" }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
            />
            
            <motion.span 
              className="text-white/80 font-light"
              variants={{
                rest: { x: 0, opacity: 0.7 },
                hover: { x: 5, opacity: 1 }
              }}
            >
              {service.duration}
            </motion.span>
            
            <motion.div
              className="relative text-right"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1 }
              }}
            >
              <motion.span 
                className="text-2xl font-light text-white relative z-10"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.2, color: "#60A5FA" }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                ${service.price}
              </motion.span>
              <span className="block text-xs text-white/60 font-light">per person</span>
              
              {/* Circular glow behind price */}
              <motion.div
                className="absolute inset-0 -m-2 bg-blue-500 rounded-full blur-xl"
                variants={{
                  rest: { opacity: 0, scale: 0.5 },
                  hover: { opacity: 0.3, scale: 1.5 }
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}