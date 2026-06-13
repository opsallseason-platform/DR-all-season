/**
 * HOMEPAGE
 * Main landing page with all sections
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { CTABanner } from '@/components/home/CTABanner';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { VideoBackgroundMobile } from '@/components/ui/VideoBackgroundMobile';
import { getFeaturedServices } from '@/lib/data/services';
import { supabaseDb } from '@/lib/supabase/db';
import { generatePageMetadata, buildLocalBusinessSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Tours en Punta Cana, Traslados de Aeropuerto y Excursiones | DR All Season'
      : 'Punta Cana Excursions, Airport Transfers & Tours | DR All Season Travel',
    description: locale === 'es'
      ? 'Reserve tours y traslados en Punta Cana con pago a la llegada. Sin pagos anticipados. Excursiones a Isla Saona, Catamarán, ATV y más. Llame (888) 599-8728.'
      : 'Book Punta Cana excursions, airport transfers & tours. Pay on arrival - no upfront payment. Saona Island, catamaran, ATV adventures. Call (888) 599-8728.',
    path: '',
    locale,
    keywords: [
      'Punta Cana excursions',
      'best excursions in Punta Cana',
      'Punta Cana airport transfer',
      'Punta Cana tours',
      'Saona Island tour',
      'Punta Cana activities',
      'things to do in Punta Cana',
      'pay on arrival Punta Cana',
      'private transfer Punta Cana',
      'PUJ airport transfer',
    ],
  });
}

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;

  // Fetch featured services from DB
  let featuredServices: any[] = [];
  let testimonials: any[] = [];
  try {
    featuredServices = await getFeaturedServices(locale);

    // Fetch testimonials/reviews from DB
    const { data: reviewsData } = await supabaseDb
      .from('reviews')
      .select('*, customers(first_name, last_name, country)')
      .order('created_at', { ascending: false })
      .limit(10);

    // Map reviews to testimonials format
    testimonials = (reviewsData || []).map((r: any) => ({
      id: r.id,
      name: r.customers ? `${r.customers.first_name} ${r.customers.last_name}` : 'Guest',
      country: r.customers?.country || '',
      rating: r.rating,
      comment: r.comment,
      avatar: '/images/placeholder.svg',
    }));

    // If no reviews in database, use placeholder testimonials
    if (testimonials.length === 0) {
      testimonials = [
        {
          id: '1',
          name: 'Sarah & Mike Thompson',
          country: 'New York, USA',
          rating: 5,
          comment: 'Amazing Saona Island tour! We paid when we arrived, no stress at all. Our guide was incredible and the beach was paradise. Highly recommend DR All Season Travel!',
          avatar: '/images/placeholder.svg',
        },
        {
          id: '2',
          name: 'Emily Rodriguez',
          country: 'Toronto, Canada',
          rating: 5,
          comment: 'Best airport transfer service! Driver was waiting for us at PUJ, very professional. Loved that we could pay with credit card upon arrival. Will definitely book again!',
          avatar: '/images/placeholder.svg',
        },
        {
          id: '3',
          name: 'James & Family',
          country: 'London, UK',
          rating: 5,
          comment: 'The ATV tour was the highlight of our vacation! Great value for money and being able to pay on arrival gave us peace of mind. The team was so friendly and helpful.',
          avatar: '/images/placeholder.svg',
        },
      ];
    }
  } catch (e) {
    console.error('[DB] Network error on homepage:', e);
    // Fallback testimonials if database is unreachable
    testimonials = [
      {
        id: '1',
        name: 'Sarah & Mike Thompson',
        country: 'New York, USA',
        rating: 5,
        comment: 'Amazing Saona Island tour! We paid when we arrived, no stress at all. Our guide was incredible and the beach was paradise. Highly recommend DR All Season Travel!',
        avatar: '/images/placeholder.svg',
      },
      {
        id: '2',
        name: 'Emily Rodriguez',
        country: 'Toronto, Canada',
        rating: 5,
        comment: 'Best airport transfer service! Driver was waiting for us at PUJ, very professional. Loved that we could pay with credit card upon arrival. Will definitely book again!',
        avatar: '/images/placeholder.svg',
      },
      {
        id: '3',
        name: 'James & Family',
        country: 'London, UK',
        rating: 5,
        comment: 'The ATV tour was the highlight of our vacation! Great value for money and being able to pay on arrival gave us peace of mind. The team was so friendly and helpful.',
        avatar: '/images/placeholder.svg',
      },
    ];
  }

  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <CustomCursor />
      <Header />
      <Hero />
      <FeaturedServices services={featuredServices} />
      
      {/* Video Background Section */}
      <div className="relative">
        {/* Fixed Video Background for These 3 Sections */}
        <VideoBackgroundMobile src="https://tourplatform-bg-videos.sfo3.cdn.digitaloceanspaces.com/home-bg.mp4" />
        
        {/* Content Over Video */}
        <div className="relative z-10">
          <WhyChooseUs />
          <Testimonials reviews={testimonials} />
          <CTABanner />
        </div>
      </div>
      
      <Footer />
    </>
  );
}
