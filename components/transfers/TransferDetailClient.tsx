'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageGallery } from '@/components/service-detail/ImageGallery';
import { Button } from '@/components/ui/Button';
import { RelatedServices } from '@/components/service-detail/RelatedServices';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TransferDetailClientProps {
  service: any;
  details: any;
  relatedServices: any[];
  extraPersonPrice: number | null;
  originalPrice?: number | null;
}

export function TransferDetailClient({ 
  service, 
  details, 
  relatedServices, 
  extraPersonPrice,
  originalPrice 
}: TransferDetailClientProps) {
  const t = useTranslations('TransferDetail');

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 text-sm text-gray-500 font-light">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {t('home')}
            </Link>
            <span>/</span>
            <Link href="/transfers" className="hover:text-gray-900 transition-colors">
              {t('transfers')}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24">
        {/* Image Gallery */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageGallery
            images={details?.galleryImages || [service.image]}
            title={service.title}
          />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left Column - Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title */}
            <div>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="text-sm tracking-[0.3em] uppercase text-gray-500 font-light">
                  {t('transferService')}
                </span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                {service.title}
              </h1>
              {service.duration && (
                <div className="flex items-center gap-2 text-gray-600 font-light">
                  <span className="text-sm tracking-wider uppercase">{service.duration}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-l-2 border-gray-200 pl-8">
              <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
                {t('serviceDescription')}
              </h2>
              <p className="text-gray-600 leading-relaxed font-light text-lg">{service.description}</p>
            </div>

            {/* What's Included */}
            {details?.inclusions && details.inclusions.length > 0 && (
              <div className="border-l-2 border-gray-200 pl-8">
                <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
                  {t('includedInTransfer')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {details.inclusions.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-900 mt-1 text-xs">—</span>
                      <span className="text-gray-600 font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {details?.requirements && details.requirements.length > 0 && (
              <div className="border-l-2 border-gray-200 pl-8">
                <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
                  {t('bookingRequirements')}
                </h2>
                <ul className="space-y-3">
                  {details.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-900 mt-1 text-xs">—</span>
                      <span className="text-gray-600 font-light">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vehicle Information */}
            <div className="bg-gray-50 p-10 rounded-2xl shadow-lg">
              <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-8 font-light">{t('vehicleInfo')}</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-l border-gray-200 pl-6">
                  <p className="font-normal text-gray-900 mb-2">{t('modernFleet')}</p>
                  <p className="text-sm text-gray-600 font-light">{t('modernFleetDesc')}</p>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <p className="font-normal text-gray-900 mb-2">{t('airConditioning')}</p>
                  <p className="text-sm text-gray-600 font-light">{t('airConditioningDesc')}</p>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <p className="font-normal text-gray-900 mb-2">{t('freeWifi')}</p>
                  <p className="text-sm text-gray-600 font-light">{t('freeWifiDesc')}</p>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <p className="font-normal text-gray-900 mb-2">{t('luggageSpace')}</p>
                  <p className="text-sm text-gray-600 font-light">{t('luggageSpaceDesc')}</p>
                </div>
              </div>
              {/* Vehicle Disclaimer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-light italic">
                  ⚠️ {t('vehicleDisclaimer')}
                </p>
              </div>
            </div>

            {/* Important Info */}
            <div className="border-l-2 border-gray-900 pl-8 py-6">
              <h3 className="font-normal text-gray-900 mb-4">{t('importantInfo')}</h3>
              <ul className="space-y-3 text-sm text-gray-600 font-light">
                <li>{t('freeCancellation')}</li>
                <li>{t('flightTracking')}</li>
                <li>{t('meetGreet')}</li>
                <li>{t('childSeats')}</li>
                <li>{t('support247')}</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Pricing Card */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 sticky top-24 rounded-2xl shadow-2xl border border-gray-700">
              {/* Price */}
              <div className="mb-8 pb-8 border-b border-gray-700">
                <div className="flex items-baseline mb-3">
                  {originalPrice && (
                    <span className="text-2xl font-light text-gray-400 line-through mr-3">${originalPrice}</span>
                  )}
                  <span className="text-5xl font-light text-white">${service.price}</span>
                  <span className="text-gray-400 ml-2 font-light">USD</span>
                </div>
                {originalPrice && (
                  <p className="text-xs font-medium text-green-400 mb-2 uppercase tracking-wider">
                    🎉 Promo Price!
                  </p>
                )}
                <p className="text-sm font-normal text-white mb-2">
                  {originalPrice
                    ? 'For 1-4 passengers'
                    : t('forPassengers')
                  }
                </p>
                {extraPersonPrice && (
                  <p className="text-sm text-gray-400 font-light">
                    +${extraPersonPrice} {originalPrice ? 'per extra passenger (5+)' : t('extraPassenger')}
                  </p>
                )}
              </div>

              {/* Route Info with Animated Vehicle */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-700 relative">
                {/* Departure */}
                <div className="border-l-2 border-blue-500 pl-4 relative z-10">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">{t('departure')}</p>
                  <p className="text-sm text-white font-light">{t('pujAirport')}</p>
                </div>
                
                {/* Animated Route Line with Vehicle */}
                <div className="relative h-24 flex items-center justify-center">
                  {/* Dotted Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500" style={{ marginLeft: '-1px' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse"></div>
                  </div>
                  
                  {/* Animated Vehicle */}
                  <motion.div
                    className="relative z-10 ml-8"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Vehicle Image - Hyundai Grand Starex */}
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 blur-xl bg-blue-500/30 rounded-full scale-150"></div>
                      
                      {/* Van Image */}
                      <img 
                        src="/images/van-timeline.png"
                        alt="Transfer Vehicle"
                        className="w-16 h-16 object-contain drop-shadow-lg relative z-10"
                      />
                      
                      {/* Motion lines */}
                      <motion.div 
                        className="absolute -left-6 top-1/2 -translate-y-1/2 flex gap-1"
                        animate={{ 
                          opacity: [0.3, 0.7, 0.3],
                          x: [0, 3, 0]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-3 h-0.5 bg-blue-400/50 rounded-full"></div>
                        <div className="w-2 h-0.5 bg-blue-400/30 rounded-full"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Destination */}
                <div className="border-l-2 border-blue-500 pl-4 relative z-10">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">{t('destination')}</p>
                  <p className="text-sm text-white font-light">{service.title.split('→')[1]?.trim()}</p>
                </div>
                
                {/* Duration */}
                {service.duration && (
                <div className="border-l-2 border-blue-500 pl-4 relative z-10">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">{t('duration')}</p>
                  <p className="text-sm text-white font-light">{service.duration}</p>
                </div>
                )}
              </div>

              {/* Book Button */}
              <Link href={`/booking?service=${service.slug}`}>
                <Button variant="primary" size="lg" className="w-full mb-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-normal tracking-wide shadow-lg hover:shadow-xl transition-all">
                  {t('bookTransfer')}
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full border-2 border-gray-600 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-light tracking-wide">
                  {t('contactUs')}
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-700 space-y-2">
                <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                  <span className="text-blue-500">✓</span> {t('payOnArrival')}
                </p>
                <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                  <span className="text-blue-500">✓</span> {t('fixedPrices')}
                </p>
                <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                  <span className="text-blue-500">✓</span> {t('assistance247')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Transfers */}
        <RelatedServices
          services={relatedServices}
          title={t('otherOptions')}
        />
      </div>

      <Footer />
    </div>
  );
}
