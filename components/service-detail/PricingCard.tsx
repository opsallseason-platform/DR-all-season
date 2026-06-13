/**
 * PRICING CARD - STICKY SIDEBAR
 * Shows price, quick info, and booking CTA
 */

import { Button } from '@/components/ui/Button';
import {Link} from '@/i18n/routing';

interface PricingPackage {
  label: string;
  adultPrice: number;
  childPrice?: number;
}

interface PricingCardProps {
  price: number;
  duration: string;
  category: string;
  serviceSlug: string;
  pricingPackages?: PricingPackage[];
}

export function PricingCard({ price, duration, category, serviceSlug, pricingPackages }: PricingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      {/* Price */}
      <div className="mb-6">
        {pricingPackages && pricingPackages.length > 1 ? (
          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-gray uppercase tracking-wide">Options</p>
            {pricingPackages.map((pkg, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-deep-navy">{pkg.label}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-caribbean-teal">${pkg.adultPrice}</span>
                  <span className="text-xs text-slate-gray ml-1">/person</span>
                  {pkg.childPrice != null && pkg.childPrice > 0 && (
                    <p className="text-xs text-slate-gray">Child: ${pkg.childPrice}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-caribbean-teal">${price}</span>
              <span className="text-slate-gray ml-2">/ person</span>
            </div>
            <p className="text-sm text-slate-gray mt-1">Fixed price, all-inclusive</p>
          </>
        )}
      </div>

      {/* Quick Info */}
      <div className="space-y-3 mb-6 pb-6 border-b border-light-gray">
        <div className="flex items-center gap-3">
          <span className="text-caribbean-teal">⏱️</span>
          <div>
            <p className="text-sm font-medium text-deep-navy">Duration</p>
            <p className="text-sm text-slate-gray">{duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caribbean-teal">🎫</span>
          <div>
            <p className="text-sm font-medium text-deep-navy">Category</p>
            <p className="text-sm text-slate-gray capitalize">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caribbean-teal">👥</span>
          <div>
            <p className="text-sm font-medium text-deep-navy">Group Size</p>
            <p className="text-sm text-slate-gray">Small groups available</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caribbean-teal">🌍</span>
          <div>
            <p className="text-sm font-medium text-deep-navy">Languages</p>
            <p className="text-sm text-slate-gray">English & Spanish</p>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <Link href={`/booking?service=${serviceSlug}`}>
        <Button variant="primary" size="lg" className="w-full mb-3">
          Book Now
        </Button>
      </Link>

      <Link href="/contact">
        <Button variant="outline" size="lg" className="w-full">
          Contact Us
        </Button>
      </Link>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-light-gray text-center space-y-2">
        <p className="text-xs text-slate-gray">✓ Free cancellation up to 24h</p>
        <p className="text-xs text-slate-gray">✓ Instant confirmation</p>
        <p className="text-xs text-slate-gray">✓ No upfront payment required</p>
      </div>
    </div>
  );
}