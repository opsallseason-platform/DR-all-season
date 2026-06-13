'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageGallery } from '@/components/service-detail/ImageGallery';
import { Button } from '@/components/ui/Button';
import { RelatedServices } from '@/components/service-detail/RelatedServices';
import { Itinerary } from '@/components/service-detail/Itinerary';
import { InclusionsExclusions } from '@/components/service-detail/InclusionsExclusions';
import { ReviewsSection } from '@/components/service-detail/ReviewsSection';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TourDetailClientProps {
  service: any;
  details: any;
  reviews: any[];
  relatedServices: any[];
}

export function TourDetailClient({ 
  service, 
  details, 
  reviews,
  relatedServices 
}: TourDetailClientProps) {
  const t = useTranslations('TourDetail');
  const isPerPerson = service.isPerPerson ?? service.category !== 'transfer';
  const childPricingAvailable = isPerPerson && (service.childPriceEnabled ?? service.category !== 'transfer') && service.childPrice > 0;

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
            <Link href="/tours" className="hover:text-gray-900 transition-colors">
              {t('toursExcursions')}
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
                  {service.category === 'tour' ? t('guidedTour') : t('excursion')}
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
                {t('overview')}
              </h2>
              <p className="text-gray-600 leading-relaxed font-light text-lg">{service.description}</p>
            </div>

            {/* Highlights */}
            {details?.highlights && (details.highlights as any[]).length > 0 && (
              <div className="border-l-2 border-gray-200 pl-8">
                <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
                  {t('highlights')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {(details.highlights as string[]).map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-900 mt-1 text-xs">—</span>
                      <span className="text-gray-600 font-light">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {details?.itinerary && (details.itinerary as any[]).length > 0 && (
              <div className="border-l-2 border-gray-200 pl-8">
                <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
                  {t('itinerary')}
                </h2>
                <Itinerary items={details.itinerary as any} />
              </div>
            )}

            {/* Inclusions & Exclusions */}
            {details?.inclusions && details?.exclusions && (
              <div>
                <InclusionsExclusions
                  inclusions={details.inclusions}
                  exclusions={details.exclusions}
                />
              </div>
            )}

            {/* Requirements */}
            {details?.requirements && (details.requirements as any[]).length > 0 && (
              <div className="border-l-2 border-gray-200 pl-8">
                <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
                  {t('whatToBring')}
                </h2>
                <ul className="space-y-3">
                  {(details.requirements as string[]).map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-900 mt-1 text-xs">—</span>
                      <span className="text-gray-600 font-light">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Info */}
            <div className="border-l-2 border-gray-900 pl-8 py-6">
              <h3 className="font-normal text-gray-900 mb-4">{t('importantInfo')}</h3>
              <ul className="space-y-3 text-sm text-gray-600 font-light">
                <li>{t('freeCancellation24h')}</li>
                <li>{t('hotelPickup')}</li>
                <li>{t('instantConfirmation')}</li>
                <li>{t('availableLanguages')}</li>
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
                {service.pricingPackages && service.pricingPackages.length > 1 ? (
                  <div className="space-y-3 mb-3">
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-light">Options</p>
                    {service.pricingPackages.map((pkg: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-700">
                        <span className="text-sm font-light text-white">{pkg.label}</span>
                        <div className="text-right">
                          <span className="text-xl font-light text-white">${pkg.adultPrice}</span>
                          <span className="text-xs text-gray-400 ml-1">/person</span>
                          {pkg.childPrice != null && pkg.childPrice > 0 && (
                            <p className="text-xs text-blue-400">Child: ${pkg.childPrice}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 mb-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-sm text-gray-400 font-light">{isPerPerson ? 'Adult (13+)' : 'Service Price'}</span>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-light text-white">${service.adultPrice || service.price}</span>
                          <span className="text-gray-400 ml-2 font-light text-sm">{isPerPerson ? 'per person' : 'flat price'}</span>
                        </div>
                      </div>
                    </div>
                    {childPricingAvailable && (
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-sm text-gray-400 font-light">Child (up to 12)</span>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-light text-blue-400">${service.childPrice}</span>
                            <span className="text-gray-400 ml-2 font-light text-sm">per person</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-400 font-light">
                  {t('fixedPriceAllInclusive')}
                </p>
              </div>

              {/* Tour Info */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-700">
                {service.duration && (
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">{t('duration')}</p>
                  <p className="text-sm text-white font-light">{service.duration}</p>
                </div>
                )}
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">{t('category')}</p>
                  <p className="text-sm text-white font-light capitalize">{service.category}</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">Open Bar</p>
                  <p className="text-sm text-white font-light">{service.hasOpenBar ? 'Included' : 'Not included'}</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-xs tracking-wider uppercase text-gray-400 mb-1 font-light">{t('groupSize')}</p>
                  <p className="text-sm text-white font-light">{t('smallGroupsAvailable')}</p>
                </div>
              </div>

              {/* Book Button */}
              <Link href={`/booking?service=${service.slug}`}>
                <Button variant="primary" size="lg" className="w-full mb-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-normal tracking-wide shadow-lg hover:shadow-xl transition-all">
                  {t('bookNow')}
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
                  <span className="text-blue-500">-</span> {t('freeCancellation')}
                </p>
                <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                  <span className="text-blue-500">-</span> {t('hotelPickupIncluded')}
                </p>
                <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                  <span className="text-blue-500">-</span> {t('instantConfirmBadge')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} />

        {/* Related Services */}
        <RelatedServices services={relatedServices} title={t('youMightAlsoLike')} />
      </div>

      <Footer />
    </div>
  );
}
