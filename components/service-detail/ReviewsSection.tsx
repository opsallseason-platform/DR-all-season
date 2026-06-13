'use client';

import { Testimonial } from '@/types';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ReviewsSectionProps {
  reviews: Testimonial[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const t = useTranslations('TourDetail');

  if (reviews.length === 0) {
    return null;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="py-20 border-t border-gray-200">
      <div className="mb-12">
        <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-light">
          {t('guestReviews')}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-light text-gray-900">{avgRating.toFixed(1)}</span>
          <div>
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < Math.round(avgRating) ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-light">
              {t('basedOnReviews', { count: reviews.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div 
            key={review.id} 
            className="bg-gray-50 p-8 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Rating dots */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < review.rating ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-600 font-light leading-relaxed mb-8">
              "{review.comment}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-light text-lg">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-normal text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-500 font-light">{review.country}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
