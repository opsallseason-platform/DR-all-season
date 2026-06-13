import TransfersPageClient from '@/components/transfers/TransfersPageClient';
import { generatePageMetadata, getBaseUrl, buildBreadcrumbSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Traslados de Aeropuerto Punta Cana (PUJ) 2026 | DR All Season'
      : 'Punta Cana Airport Transfer (PUJ) 2026 | Pay on Arrival | DR All Season',
    description: locale === 'es'
      ? 'Traslado privado desde Aeropuerto Punta Cana (PUJ) a Bávaro, Cap Cana, Uvero Alto. Vehículos modernos con WiFi. Reserve y pague a la llegada. (888) 599-8728.'
      : 'Private Punta Cana airport transfer (PUJ) to Bavaro, Cap Cana, Uvero Alto. Modern vehicles with WiFi & water. Book now, pay on arrival. Call (888) 599-8728.',
    path: '/transfers',
    locale,
    keywords: [
      'Punta Cana airport transfer',
      'PUJ airport transfer',
      'private transfer Punta Cana',
      'Punta Cana airport shuttle',
      'airport pickup Punta Cana',
      'Punta Cana airport transportation',
      'Bavaro transfer',
      'Cap Cana transfer',
      'affordable Punta Cana airport transfer',
      'Punta Cana group transportation',
    ],
  });
}

export default function TransfersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const baseUrl = getBaseUrl();

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'es' ? 'Traslados' : 'Transfers', url: `${baseUrl}/${locale}/transfers` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <TransfersPageClient />
    </>
  );
}
