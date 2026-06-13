import { generatePageMetadata, buildLocalBusinessSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Contactenos - D.R All Season Travel'
      : 'Contact Us - D.R All Season Travel',
    description: locale === 'es'
      ? 'Contacte a D.R All Season Travel para reservas de tours, traslados de aeropuerto y excursiones en Republica Dominicana. Disponibles 24/7 por WhatsApp, telefono y email.'
      : 'Contact D.R All Season Travel for tour bookings, airport transfers, and excursions in the Dominican Republic. Available 24/7 via WhatsApp, phone, and email.',
    path: '/contact',
    locale,
    keywords: [
      'contact travel agency Dominican Republic',
      'Punta Cana tour booking',
      'WhatsApp booking Dominican Republic',
      'airport transfer reservation',
    ],
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    ...buildLocalBusinessSchema(),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      availableLanguage: ['English', 'Spanish'],
      areaServed: 'DO',
    },
  };

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
