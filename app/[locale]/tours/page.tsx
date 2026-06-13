import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TourHeroClean } from '@/components/tours/TourHero';
import { ToursClient } from '@/components/tours/ToursClient';
import { getToursAndExcursions } from '@/lib/data/services';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { generatePageMetadata, getBaseUrl, buildBreadcrumbSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

import { Service } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Mejores Tours y Excursiones en Punta Cana 2026 | DR All Season'
      : 'Best Punta Cana Tours & Excursions 2026 | Pay on Arrival | DR All Season',
    description: locale === 'es'
      ? 'Descubra las mejores excursiones en Punta Cana: Isla Saona, Isla Catalina, ATV, Catamarán y más. Reserve hoy y pague a la llegada. Guias expertos locales.'
      : 'Discover the best Punta Cana excursions: Saona Island, Catalina Island, ATV, catamaran & more. Book today and pay on arrival. Expert local guides. Call (888) 599-8728.',
    path: '/tours',
    locale,
    keywords: [
      'Punta Cana excursions',
      'best excursions in Punta Cana',
      'Punta Cana tours',
      'Saona Island tour',
      'Catalina Island tour',
      'ATV tour Punta Cana',
      'catamaran Punta Cana',
      'things to do in Punta Cana',
      'Punta Cana day trips',
      'Punta Cana adventures',
      'book Punta Cana excursions pay on arrival',
    ],
  });
}


export default async function ToursPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  let services: Service[] = [];
  try {
    services = await getToursAndExcursions(locale);
  } catch {
    // DB unreachable — render with empty list
  }

  const baseUrl = getBaseUrl();
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'es' ? 'Tours y Excursiones' : 'Tours & Excursions', url: `${baseUrl}/${locale}/tours` },
  ]);

  return (
    <div className="relative">
      <JsonLd data={breadcrumb} />
      <CustomCursor />
      <Header />
      <TourHeroClean />
      <ToursClient initialServices={services} />
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}