'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TransferCard } from '@/components/transfers/TransferCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Service } from '@/types';
import { useTranslations } from 'next-intl';

export default function TransfersPageClient() {
  const t = useTranslations('Transfers');
  const [transfers, setTransfers] = useState<Service[]>([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    async function loadTransfers() {
      try {
        const response = await fetch('/api/transfers');
        const data = await response.json();
        setTransfers(Array.isArray(data) ? data : []);
      } catch {
        setTransfers([]);
      }
    }
    loadTransfers();
  }, []);

  return (
    <div className="relative">
      <Header />
      
      {/* Fixed Video Background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://tourplatform-bg-videos.sfo3.cdn.digitaloceanspaces.com/transfers-bg.mov" type="video/quicktime" />
          <source src="https://tourplatform-bg-videos.sfo3.cdn.digitaloceanspaces.com/transfers-bg.mp4" type="video/mp4" />
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
            <span className="block">{t('titleLine1')}</span>
            <span className="block mt-2">
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent italic font-semibold"
                initial={{ x: "-100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 20,
                  delay: 1.2,
                  duration: 1.5
                }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2.5
                  }}
                  style={{
                    backgroundImage: "linear-gradient(to right, rgb(96, 165, 250), rgb(103, 232, 249), rgb(96, 165, 250))",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    display: "inline-block"
                  }}
                >
                  {t('titleLine2')}
                </motion.span>
              </motion.span>
            </span>
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

      {/* Transfer Cards - Floating over video */}
      <div className="relative py-24 z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {transfers.map((transfer) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20 rounded-2xl"
              >
                <TransferCard service={transfer} />
              </motion.div>
            ))}
          </div>

          {/* Vehicle Disclaimer */}
          <div className="max-w-6xl mx-auto mt-8">
            <p className="text-xs text-white/60 font-light italic text-center">
              ⚠️ {t('vehicleNote')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
