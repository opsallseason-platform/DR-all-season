/**
 * CONTACT PAGE
 * Contact form and company information
 */
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { ContactForm } from '@/components/contact/ContactForm';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';


export default function ContactPage() {
  const t = useTranslations('Contact');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

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
          className="w-full h-full object-cover"
        >
          <source src="/images/videos/bg-contact.mov" type="video/quicktime" />
          <source src="/images/videos/bg-contact.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
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
            className="text-5xl md:text-7xl lg:text-9xl font-semibold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('titleLine1')}
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

      {/* Main Content - Scroll over video */}
      <div className="container mx-auto px-6 py-24 relative z-10">
        <motion.div 
          className="grid lg:grid-cols-2 gap-20 max-w-6xl mx-auto bg-white/95 backdrop-blur-sm p-12 shadow-2xl rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Contact Form */}
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6">{t('sendMessage')}</p>
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              {t('tellUsPlans')}
            </h2>
            <p className="text-gray-600 mb-8 font-light leading-relaxed">
              {t('formDescription')}
            </p>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-8">{t('getInTouch')}</p>
            </div>

            {/* Phone */}
            <div className="border-l border-gray-200 pl-6">
              <h3 className="font-normal text-gray-900 mb-2">{t('phone')}</h3>
              <a href="tel:+18885998728" className="text-gray-600 hover:text-gray-900 transition-colors block mb-1">
                +1 (888) 599-8728
              </a>
              <p className="text-sm text-gray-500 font-light">{t('phoneAvailable')}</p>
            </div>

            {/* Email */}
            <div className="border-l border-gray-200 pl-6">
              <h3 className="font-normal text-gray-900 mb-2">{t('email')}</h3>
              <a href="mailto:info@drallseasontravel.com" className="text-gray-600 hover:text-gray-900 transition-colors block mb-1">
                info@drallseasontravel.com
              </a>
              <p className="text-sm text-gray-500 font-light">{t('emailReply')}</p>
            </div>

            {/* Location */}
            <div className="border-l border-gray-200 pl-6">
              <h3 className="font-normal text-gray-900 mb-2">{t('locationTitle')}</h3>
              <p className="text-gray-600 mb-1">{t('locationCity')}</p>
              <p className="text-gray-600">{t('locationCountry')}</p>
            </div>

            {/* Business Hours */}
            <div className="border-l border-gray-200 pl-6">
              <h3 className="font-normal text-gray-900 mb-2">{t('businessHours')}</h3>
              <p className="text-gray-600 text-sm font-light mb-1">{t('mondayFriday')}</p>
              <p className="text-gray-600 text-sm font-light mb-1">{t('saturday')}</p>
              <p className="text-gray-600 text-sm font-light mb-3">{t('sunday')}</p>
              <p className="text-sm text-gray-900 font-light">{t('emergencySupport')}</p>
            </div>

            {/* WhatsApp */}
            <div className="border-l-2 border-gray-900 pl-6">
              <h3 className="font-normal text-gray-900 mb-2">{t('whatsapp')}</h3>
              <a href="https://wa.me/18096973315" className="text-gray-600 hover:text-gray-900 transition-colors block mb-2">
                +1 (809) 697-3315
              </a>
              <p className="text-sm text-gray-600 font-light">
                {t('whatsappDescription')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Maps Section */}
        <motion.section 
          className="mt-32 bg-white/95 backdrop-blur-sm p-12 shadow-2xl max-w-6xl mx-auto rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12 text-center">Our Locations</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Location 1 - Bávaro / Main Office */}
            <div className="flex flex-col">
              <h3 className="text-lg font-normal text-gray-900 mb-6">
                Bávaro - Main Office
              </h3>
              <div className="relative w-full h-96 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d483907.8191076416!2d-69.06337234385873!3d18.64020543018859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa1a1fb47a7b67835%3A0x89fca451a8caa0e8!2sRd%20all%20season%20travel!5e0!3m2!1sen!2smx!4v1765342540929!5m2!1sen!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RD All Season Travel - Bávaro"
                />
              </div>
              <p className="text-gray-500 mt-4 text-sm font-light">
                Punta Cana / Bávaro Area
              </p>
            </div>

            {/* Location 2 - Closer to Airport / Punta Cana Bay */}
            <div className="flex flex-col">
              <h3 className="text-lg font-normal text-gray-900 mb-6">
                Punta Cana - Near Airport
              </h3>
              <div className="relative w-full h-96 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.3694059507084!2d-68.43785842506045!3d18.602447282507093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea8952f7395e80f%3A0x1ca298dda33674b6!2sRD%20ALL%20SEASON%20TRAVEL!5e0!3m2!1sen!2smx!4v1765342646181!5m2!1sen!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RD All Season Travel - Punta Cana Airport Area"
                />
              </div>
              <p className="text-gray-500 mt-4 text-sm font-light">
                Downtown Punta Cana (close to PUJ Airport)
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}