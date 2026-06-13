import { notFound } from 'next/navigation';
import { TourDetailClient } from '@/components/tours/TourDetailClient';
import {
  getServiceBySlug,
  getServiceDetails,
  getRelatedServices,
  getServiceReviews,
} from '@/lib/data/services';
import { generatePageMetadata, buildTourSchema, getBaseUrl, buildBreadcrumbSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

interface TourDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug, locale } = params;
  let service: any = null;
  try {
    service = await getServiceBySlug(slug, locale);
  } catch {
    return { title: 'Tour' };
  }

  if (!service) {
    return { title: 'Tour Not Found' };
  }

  const imageUrl = service.image.startsWith('http') ? service.image : `${getBaseUrl()}${service.image}`;

  return generatePageMetadata({
    title: service.title,
    description: service.description,
    path: `/tours/${slug}`,
    locale,
    ogImage: imageUrl,
    keywords: [
      service.title,
      'Dominican Republic tour',
      'Punta Cana excursion',
      `${service.title} booking`,
    ],
  });
}

export const dynamic = 'force-dynamic';

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug, locale } = params;

  let service;
  try {
    service = await getServiceBySlug(slug, locale);
  } catch {
    // Supabase unreachable
  }

  if (!service) {
    notFound();
  }

  let details: any, reviews: any[] = [], relatedServices: any[] = [];
  try {
    [details, reviews, relatedServices] = await Promise.all([
      getServiceDetails(slug, locale),
      getServiceReviews(service.id),
      getRelatedServices(service.id, service.category),
    ]);
  } catch {
    details = { galleryImages: [service.image], itinerary: null, inclusions: [], exclusions: [], requirements: [], highlights: null };
    reviews = [];
    relatedServices = [];
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : undefined;

  const tourSchema = buildTourSchema({
    name: service.title,
    description: service.description,
    slug: service.slug,
    image: service.image,
    price: service.price,
    duration: service.duration,
    locale,
    rating: avgRating,
    reviewCount: reviews.length > 0 ? reviews.length : undefined,
  });

  const baseUrl = getBaseUrl();
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'es' ? 'Tours' : 'Tours', url: `${baseUrl}/${locale}/tours` },
    { name: service.title, url: `${baseUrl}/${locale}/tours/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={[tourSchema, breadcrumb]} />
      <TourDetailClient 
        service={service}
        details={details}
        reviews={reviews}
        relatedServices={relatedServices}
      />
    </>
  );
}
