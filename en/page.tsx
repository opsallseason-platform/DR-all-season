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
import { getFeaturedServices } from '@/lib/data/services';
import { supabaseDb } from '@/lib/supabase/db';

export default async function Home() {
  const featuredServices = await getFeaturedServices('en');

  const { data: reviewsData } = await supabaseDb
    .from('reviews')
    .select('*, customers(first_name, last_name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(3);

  const testimonials = (reviewsData || []).map((r: any) => ({
    id: r.id,
    name: r.customers ? `${r.customers.first_name} ${r.customers.last_name}` : 'Guest',
    country: '',
    rating: r.rating,
    comment: r.comment,
    avatar: '/images/placeholder.svg',
  }));

  return (
    <>
      <Header />
      <Hero />
      <FeaturedServices services={featuredServices} />
      <WhyChooseUs />
      <Testimonials reviews={testimonials} />
      <CTABanner />
      <Footer />
    </>
  );
}