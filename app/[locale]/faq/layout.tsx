import { generatePageMetadata, buildFAQSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';

// FAQ data for schema (uses English for structured data)
const faqItems = [
  { question: 'How do I book a tour or transfer?', answer: 'You can book directly through our website by clicking the "Book Now" button on any tour or transfer page. You can also contact us via phone, email, or WhatsApp for personalized assistance.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and cash payments. For transfers, you can pay the driver directly upon arrival.' },
  { question: 'Do I need to pay in advance?', answer: 'For tours and excursions, we require full payment at booking. For transfers, you can pay upon arrival or book with a minimum advance payment.' },
  { question: 'Are prices per person or per group?', answer: 'Tour and excursion prices are per person. Transfer prices are fixed for groups of 1-6 passengers, with additional charges for extra passengers.' },
  { question: 'What is included in the tour price?', answer: 'All tours include round-trip transportation, professional bilingual guides, entrance fees to attractions, and any meals specified in the itinerary.' },
  { question: 'Are tours suitable for children?', answer: 'Most of our tours are family-friendly. However, some activities like zip-lining have age and weight restrictions.' },
  { question: 'How does airport pickup work?', answer: 'Your driver will meet you at the airport arrivals area holding a sign with your name. We track your flight, so if there are delays, your driver will adjust accordingly. No extra charges for flight delays.' },
  { question: 'What if I have extra luggage?', answer: 'Our vehicles have ample space for standard luggage (2 bags per person). If you have oversized items like surfboards or golf clubs, please let us know when booking.' },
  { question: 'What is your cancellation policy?', answer: 'Free cancellation up to 24 hours before your scheduled activity. Cancellations within 24 hours or no-shows are non-refundable. Weather-related cancellations are fully refundable.' },
  { question: 'What if the weather is bad?', answer: 'Safety first! If weather conditions make an activity unsafe, we will offer to reschedule or provide a full refund. We monitor weather closely and will notify you in advance.' },
  { question: 'Can I reschedule my booking?', answer: 'Yes, rescheduling is free if done at least 24 hours before your original booking. Subject to availability.' },
];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Preguntas Frecuentes - Tours, Traslados y Excursiones'
      : 'FAQ - Tours, Transfers & Excursions',
    description: locale === 'es'
      ? 'Respuestas a preguntas frecuentes sobre reservas, pagos, politicas de cancelacion, tours y traslados de aeropuerto en Republica Dominicana.'
      : 'Answers to frequently asked questions about bookings, payments, cancellation policies, tours, and airport transfers in the Dominican Republic.',
    path: '/faq',
    locale,
    keywords: [
      'FAQ Dominican Republic tours',
      'Punta Cana transfer questions',
      'booking cancellation policy',
      'tour payment methods',
    ],
  });
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = buildFAQSchema(faqItems);

  return (
    <>
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
