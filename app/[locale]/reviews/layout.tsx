import { generatePageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Resenas de Clientes - D.R All Season Travel'
      : 'Customer Reviews - D.R All Season Travel',
    description: locale === 'es'
      ? 'Lea resenas reales de viajeros que disfrutaron nuestros tours, excursiones y traslados en Republica Dominicana. Calificacion promedio de 4.9 estrellas.'
      : 'Read real reviews from travelers who enjoyed our tours, excursions, and transfers in the Dominican Republic. Average rating of 4.9 stars.',
    path: '/reviews',
    locale,
    keywords: [
      'D.R All Season Travel reviews',
      'Punta Cana tour reviews',
      'Dominican Republic transfer reviews',
      'customer testimonials travel',
    ],
  });
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
