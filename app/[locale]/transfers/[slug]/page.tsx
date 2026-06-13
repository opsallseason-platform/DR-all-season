/**
 * TRANSFER DETAIL PAGE
 * Dynamic route for individual transfers
 * Simpler layout than tours
 */

import { notFound } from 'next/navigation';
import { TransferDetailClient } from '@/components/transfers/TransferDetailClient';
import {
  getServiceBySlug,
  getServiceDetails,
  getRelatedServices,
} from '@/lib/data/services';
import { generatePageMetadata, buildTransferSchema, getBaseUrl, buildBreadcrumbSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

interface TransferDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: TransferDetailPageProps): Promise<Metadata> {
  const { slug, locale } = params;
  let service: any = null;
  try {
    service = await getServiceBySlug(slug, locale);
  } catch {
    return { title: 'Transfer' };
  }

  if (!service) {
    return { title: 'Transfer Not Found' };
  }

  const imageUrl = service.image.startsWith('http') ? service.image : `${getBaseUrl()}${service.image}`;

  return generatePageMetadata({
    title: service.title,
    description: service.description,
    path: `/transfers/${slug}`,
    locale,
    ogImage: imageUrl,
    keywords: [
      service.title,
      'airport transfer Dominican Republic',
      'Punta Cana private transfer',
      'PUJ airport shuttle',
    ],
  });
}

export default async function TransferDetailPage({ params }: TransferDetailPageProps) {
  const { slug, locale } = params;

  let service;
  try {
    service = await getServiceBySlug(slug, locale);
  } catch {
    // Supabase unreachable
  }

  if (!service || service.category !== 'transfer') {
    notFound();
  }

  let details: any, relatedServices: any[] = [];
  try {
    [details, relatedServices] = await Promise.all([
      getServiceDetails(slug, locale),
      getRelatedServices(service.id, 'transfer'),
    ]);
  } catch {
    details = { galleryImages: [service.image], itinerary: null, inclusions: [], exclusions: [], requirements: [], highlights: null };
    relatedServices = [];
  }

  const extraPersonPrice = service.extraPersonPrice || null;

  const transferSchema = buildTransferSchema({
    name: service.title,
    description: service.description,
    slug: service.slug,
    image: service.image,
    price: service.price,
    duration: service.duration,
    locale,
  });

  const baseUrl = getBaseUrl();
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'es' ? 'Traslados' : 'Transfers', url: `${baseUrl}/${locale}/transfers` },
    { name: service.title, url: `${baseUrl}/${locale}/transfers/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={[transferSchema, breadcrumb]} />
      <TransferDetailClient 
        service={service}
        details={details}
        relatedServices={relatedServices}
        extraPersonPrice={extraPersonPrice}
        originalPrice={service.originalPrice || null}
      />
    </>
  );
}