import { Metadata } from 'next';

// ─── Base Configuration ───────────────────────────────────────────────────────

const BASE_URL = 'https://drallseasontravel.com';
const SITE_NAME = 'D.R All Season Travel';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/Hero_BG.png`;

export function getBaseUrl(): string {
  return BASE_URL;
}

// ─── Metadata Builder ─────────────────────────────────────────────────────────

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  locale: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generatePageMetadata({
  title,
  description,
  path,
  locale,
  ogImage,
  noIndex = false,
  keywords,
}: PageMetadataOptions): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        es: `${BASE_URL}/es${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'es' ? 'es_DO' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_DO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || DEFAULT_OG_IMAGE],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

// ─── JSON-LD Schema Builders ──────────────────────────────────────────────────

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    name: SITE_NAME,
    description:
      'Premium airport transfers, tours, and excursions in the Dominican Republic. Serving Punta Cana, Bavaro, Cap Cana, La Romana, Samana, and Santo Domingo. All services can be paid upon arrival with credit card or cash.',
    url: BASE_URL,
    logo: `${BASE_URL}/images/DR_Logo.png`,
    image: DEFAULT_OG_IMAGE,
    telephone: '+1-888-599-8728',
    email: 'info@drallseasontravel.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Punta Cana',
      addressRegion: 'La Altagracia',
      addressCountry: 'DO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.5601,
      longitude: -68.3725,
    },
    areaServed: [
      { '@type': 'Place', name: 'Punta Cana' },
      { '@type': 'Place', name: 'Bavaro' },
      { '@type': 'Place', name: 'Cap Cana' },
      { '@type': 'Place', name: 'Cabeza de Toro' },
      { '@type': 'Place', name: 'La Romana' },
      { '@type': 'Place', name: 'Samana' },
      { '@type': 'Place', name: 'Santo Domingo' },
      { '@type': 'Place', name: 'Uvero Alto' },
      { '@type': 'Place', name: 'Bayahibe' },
    ],
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    // Google Business Profile Integration
    hasMap: 'https://www.google.com/maps?cid=9943002747958370536',
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Verified Customer',
        },
        reviewBody: 'Excellent service! Paid upon arrival with credit card. Highly recommend for Punta Cana airport transfers.',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://www.google.com/maps?cid=9943002747958370536',
      'https://www.google.com/maps?cid=2063379656982557878',
    ],
  };
}

interface TourSchemaOptions {
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  duration: string;
  locale: string;
  rating?: number;
  reviewCount?: number;
}

export function buildTourSchema({
  name,
  description,
  slug,
  image,
  price,
  duration,
  locale,
  rating,
  reviewCount,
}: TourSchemaOptions) {
  const url = `${BASE_URL}/${locale}/tours/${slug}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    url,
    image: imageUrl,
    touristType: 'Adventure',
    provider: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
    itinerary: {
      '@type': 'ItemList',
      description: `Duration: ${duration}`,
    },
    ...(rating &&
      reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          reviewCount: reviewCount.toString(),
          bestRating: '5',
          worstRating: '1',
        },
      }),
  };
}

interface TransferSchemaOptions {
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  duration: string;
  locale: string;
}

export function buildTransferSchema({
  name,
  description,
  slug,
  image,
  price,
  duration,
  locale,
}: TransferSchemaOptions) {
  const url = `${BASE_URL}/${locale}/transfers/${slug}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Duration',
      value: duration,
    },
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
