import { notFound } from 'next/navigation';
import { TourDetailClient } from '@/components/tours/TourDetailClient';
import {
  getServiceBySlug,
  getServiceDetails,
  getRelatedServices,
  getServiceReviews,
} from '@/lib/data/services';

interface TourDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = params;

  let service;
  try {
    service = await getServiceBySlug(slug);
  } catch {
    // Supabase unreachable
  }

  if (!service) {
    notFound();
  }

  let details: any, reviews: any[] = [], relatedServices: any[] = [];
  try {
    [details, reviews, relatedServices] = await Promise.all([
      getServiceDetails(slug),
      getServiceReviews(service.id),
      getRelatedServices(service.id, service.category),
    ]);
  } catch {
    details = { galleryImages: [service.image], itinerary: null, inclusions: [], exclusions: [], requirements: [], highlights: null };
    reviews = [];
    relatedServices = [];
  }

  return (
    <TourDetailClient 
      service={service}
      details={details}
      reviews={reviews}
      relatedServices={relatedServices}
    />
  );
}
