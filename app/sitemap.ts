import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo/metadata';
import { supabaseDb } from '@/lib/supabase/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/tours',
    '/transfers',
    '/contact',
    '/faq',
    '/reviews',
  ];

  const locales = ['en', 'es'];

  // Generate static page entries for both locales
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
      priority: path === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${path}`,
          es: `${baseUrl}/es${path}`,
        },
      },
    }))
  );

  // Fetch dynamic tour/excursion slugs
  const { data: tours } = await supabaseDb
    .from('services')
    .select('slug_en, updated_at')
    .eq('status', 'active')
    .in('category', ['tour', 'excursion']);

  const tourEntries: MetadataRoute.Sitemap = (tours || []).flatMap((tour: any) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/tours/${tour.slug_en}`,
      lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/tours/${tour.slug_en}`,
          es: `${baseUrl}/es/tours/${tour.slug_en}`,
        },
      },
    }))
  );

  // Fetch dynamic transfer slugs
  const { data: transfers } = await supabaseDb
    .from('services')
    .select('slug_en, updated_at')
    .eq('status', 'active')
    .eq('category', 'transfer');

  const transferEntries: MetadataRoute.Sitemap = (transfers || []).flatMap((transfer: any) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/transfers/${transfer.slug_en}`,
      lastModified: transfer.updated_at ? new Date(transfer.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/transfers/${transfer.slug_en}`,
          es: `${baseUrl}/es/transfers/${transfer.slug_en}`,
        },
      },
    }))
  );

  return [...staticEntries, ...tourEntries, ...transferEntries];
}
