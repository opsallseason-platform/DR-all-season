// app/[locale]/layout.tsx
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import ChatWidget from '@/components/chat/ChatWidget';
import { CookieConsent } from '@/components/privacy/CookieConsent';
import { getBaseUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const isEs = locale === 'es';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: isEs
        ? 'D.R All Season Travel | Traslados, Tours y Excursiones en Republica Dominicana'
        : 'D.R All Season Travel | Airport Transfers, Tours & Excursions in Dominican Republic',
      template: isEs ? '%s | D.R All Season Travel' : '%s | D.R All Season Travel',
    },
    description: isEs
      ? 'Traslados de aeropuerto premium, tours y excursiones en Republica Dominicana. Sirviendo Punta Cana, Bavaro, Cap Cana, La Romana, Samana y Santo Domingo.'
      : 'Premium airport transfers, tours, and excursions in the Dominican Republic. Serving Punta Cana, Bavaro, Cap Cana, La Romana, Samana, and Santo Domingo.',
    keywords: [
      'Punta Cana airport transfer',
      'Dominican Republic tours',
      'excursions Punta Cana',
      'airport shuttle Dominican Republic',
      'Saona Island tour',
      'Samana whale watching',
      'Bavaro excursions',
    ],
    authors: [{ name: 'D.R All Season Travel' }],
    creator: 'D.R All Season Travel',
    publisher: 'D.R All Season Travel',
    openGraph: {
      type: 'website',
      siteName: 'D.R All Season Travel',
      locale: isEs ? 'es_DO' : 'en_US',
      alternateLocale: isEs ? 'en_US' : 'es_DO',
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {},
  };
}

export default async function LocaleLayout({children, params: {locale}}: Props) {
  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering and provide locale to server components
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <ChatWidget />
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
