import { generatePageMetadata, buildLocalBusinessSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Sobre Nosotros - D.R All Season Travel'
      : 'About Us - D.R All Season Travel',
    description: locale === 'es'
      ? 'Conozca D.R All Season Travel: mas de 12 anos brindando traslados premium, tours y excursiones en la Republica Dominicana. Guias locales expertos y servicio personalizado.'
      : 'Meet D.R All Season Travel: over 12 years providing premium transfers, tours, and excursions in the Dominican Republic. Expert local guides and personalized service.',
    path: '/about',
    locale,
    keywords: [
      'D.R All Season Travel',
      'Dominican Republic travel company',
      'Punta Cana tour operator',
      'about us travel agency',
    ],
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      {children}
    </>
  );
}
