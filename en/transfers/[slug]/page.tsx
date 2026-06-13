/**
 * TRANSFER DETAIL PAGE
 * Dynamic route for individual transfers
 * Simpler layout than tours
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageGallery } from '@/components/service-detail/ImageGallery';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RelatedServices } from '@/components/service-detail/RelatedServices';
import {
  getServiceBySlug,
  getServiceDetails,
  getRelatedServices,
} from '@/lib/data/services';

interface TransferDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function TransferDetailPage({ params }: TransferDetailPageProps) {
  const { slug } = params;

  // Fetch service data
  const service = await getServiceBySlug(slug);

  if (!service || service.category !== 'transfer') {
    notFound();
  }

  // Fetch additional details
  const details = await getServiceDetails(slug);
  const relatedServices = await getRelatedServices(service.id, 'transfer');

  // Parse pricing info for transfers
  const isBasicTransfer = service.price < 100; // Simple logic for grouping
  const extraPersonPrice = isBasicTransfer
    ? service.price <= 33
      ? 6
      : service.price <= 58
      ? 10
      : 15
    : null;

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-cloud-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-gray">
            <Link href="/" className="hover:text-caribbean-teal">
              Home
            </Link>
            <span>/</span>
            <Link href="/transfers" className="hover:text-caribbean-teal">
              Transfers
            </Link>
            <span>/</span>
            <span className="text-deep-navy">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Image Gallery */}
        <div className="mb-12">
          <ImageGallery
            images={details?.galleryImages || [service.image]}
            title={service.title}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <div className="mb-3">
                <span className="px-3 py-1 bg-caribbean-teal text-white text-sm font-medium rounded-full">
                  Transfer Service
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-navy mb-4">
                {service.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-gray">
                <span>⏱️</span>
                <span>{service.duration}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-deep-navy mb-4">
                Service Description
              </h2>
              <p className="text-slate-gray leading-relaxed">{service.description}</p>
            </div>

            {/* What's Included */}
            {details?.inclusions && details.inclusions.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-deep-navy mb-4">
                  Included in Your Transfer
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {details.inclusions.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-caribbean-teal mt-1">✓</span>
                      <span className="text-slate-gray">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {details?.requirements && details.requirements.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-deep-navy mb-4">
                  Booking Requirements
                </h2>
                <ul className="space-y-2">
                  {details.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-caribbean-teal mt-1">•</span>
                      <span className="text-slate-gray">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vehicle Information */}
            <Card className="bg-cloud-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-deep-navy mb-4">Vehicle Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <p className="font-medium text-deep-navy">Modern Fleet</p>
                      <p className="text-sm text-slate-gray">SUVs and vans, 2020 or newer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❄️</span>
                    <div>
                      <p className="font-medium text-deep-navy">Air Conditioning</p>
                      <p className="text-sm text-slate-gray">Climate controlled comfort</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-medium text-deep-navy">Free WiFi</p>
                      <p className="text-sm text-slate-gray">Stay connected on the go</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🧳</span>
                    <div>
                      <p className="font-medium text-deep-navy">Luggage Space</p>
                      <p className="text-sm text-slate-gray">Ample room for all bags</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Info */}
            <div className="bg-caribbean-teal/10 border border-caribbean-teal/30 rounded-lg p-6">
              <h3 className="font-semibold text-deep-navy mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-slate-gray">
                <li>• Free cancellation up to 24 hours before pickup</li>
                <li>• Flight tracking included - we monitor your arrival</li>
                <li>• Meet & greet service at airport arrivals</li>
                <li>• Child seats available upon request (free)</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-caribbean-teal">${service.price}</span>
                  <span className="text-slate-gray ml-2">USD</span>
                </div>
                <p className="text-sm font-semibold text-deep-navy mb-2">
                  For 1-6 passengers
                </p>
                {extraPersonPrice && (
                  <p className="text-sm text-slate-gray">
                    +${extraPersonPrice} per extra passenger (7+)
                  </p>
                )}
              </div>

              {/* Route Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-light-gray">
                <div className="flex items-start gap-3">
                  <span className="text-caribbean-teal">📍</span>
                  <div>
                    <p className="text-sm font-medium text-deep-navy">Departure</p>
                    <p className="text-sm text-slate-gray">Punta Cana Airport (PUJ)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-caribbean-teal">🏨</span>
                  <div>
                    <p className="text-sm font-medium text-deep-navy">Destination</p>
                    <p className="text-sm text-slate-gray">{service.title.split('→')[1]?.trim()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-caribbean-teal">⏱️</span>
                  <div>
                    <p className="text-sm font-medium text-deep-navy">Duration</p>
                    <p className="text-sm text-slate-gray">{service.duration}</p>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <Link href={`/booking?service=${service.slug}`}>
                <Button variant="primary" size="lg" className="w-full mb-3">
                  Book Transfer
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full">
                  Contact Us
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-light-gray text-center space-y-2">
                <p className="text-xs text-slate-gray">✓ Pay on arrival</p>
                <p className="text-xs text-slate-gray">✓ Fixed prices, no surprises</p>
                <p className="text-xs text-slate-gray">✓ 24/7 assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Transfers */}
        <RelatedServices
          services={relatedServices}
          title="Other Transfer Options"
        />
      </div>

      <Footer />
    </div>
  );
}

// Generate static params for all transfers
export async function generateStaticParams() {
  const { supabaseDb } = await import('@/lib/supabase/db');
  
  const { data } = await supabaseDb
    .from('services')
    .select('slug_en')
    .eq('status', 'active')
    .eq('category', 'transfer');

  return (data || []).map((service: any) => ({
    slug: service.slug_en,
  }));
}