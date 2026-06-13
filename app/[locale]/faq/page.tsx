/**
 * FAQ PAGE
 * Frequently asked questions with accordion
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { generatePageMetadata, buildFAQSchema, getBaseUrl, buildBreadcrumbSchema } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  return generatePageMetadata({
    title: locale === 'es'
      ? 'Preguntas Frecuentes - Tours y Traslados en Punta Cana | DR All Season'
      : 'Punta Cana Tours FAQ - Excursions, Transfers & Travel Guide | DR All Season',
    description: locale === 'es'
      ? 'Respuestas a preguntas frecuentes sobre tours, excursiones y traslados en Punta Cana. Reserve hoy y pague a la llegada. Llame (888) 599-8728.'
      : 'FAQs about Punta Cana excursions, airport transfers & tours. Learn about booking, pricing, pay-on-arrival policy. Call (888) 599-8728.',
    path: '/faq',
    locale,
    keywords: [
      'Punta Cana excursions FAQ',
      'Punta Cana airport transfer questions',
      'book Punta Cana tours pay on arrival',
      'Punta Cana travel guide',
      'things to know before visiting Punta Cana',
    ],
  });
}

export default async function FAQPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const baseUrl = getBaseUrl();

  // Static FAQ data for schema (matches client component)
  const faqData = [
    {
      question: locale === 'es' ? '¿Cómo reservo un tour o traslado?' : 'How do I book a tour or transfer?',
      answer: locale === 'es'
        ? 'Puede reservar directamente en nuestro sitio web haciendo clic en "Reservar ahora" en cualquier página de tour o traslado. También puede contactarnos por teléfono, correo electrónico o WhatsApp para asistencia personalizada.'
        : 'You can book directly through our website by clicking the "Book Now" button on any tour or transfer page. You can also contact us via phone, email, or WhatsApp for personalized assistance.',
    },
    {
      question: locale === 'es' ? '¿Necesito pagar por adelantado?' : 'Do I need to pay in advance?',
      answer: locale === 'es'
        ? '¡No! Todos los servicios se pueden pagar a la llegada. Simplemente reserve hoy y pague cuando llegue usando tarjeta de crédito (Visa, Mastercard, American Express) o efectivo. Cero riesgo financiero.'
        : 'No upfront payment required! All tours, excursions, and transfers can be paid upon arrival. Simply book today and pay when you arrive using credit card (Visa, Mastercard, American Express) or cash. Zero financial risk.',
    },
    {
      question: locale === 'es' ? '¿Qué métodos de pago aceptan?' : 'What payment methods do you accept?',
      answer: locale === 'es'
        ? 'Aceptamos tarjetas de crédito (Visa, Mastercard, American Express) y pagos en efectivo. Todos los servicios se pueden pagar a la llegada — sin pagos anticipados requeridos.'
        : 'We accept credit cards (Visa, Mastercard, American Express) and cash payments. All services can be paid upon arrival — no upfront payment required.',
    },
    {
      question: locale === 'es' ? '¿Cómo funciona la recogida en el aeropuerto?' : 'How does airport pickup work?',
      answer: locale === 'es'
        ? 'Su conductor lo esperará en el área de llegadas del aeropuerto con un letrero con su nombre. Monitoreamos su vuelo, por lo que si hay retrasos, su conductor se ajustará en consecuencia. Sin cargos adicionales por retrasos de vuelos.'
        : 'Your driver will meet you at the airport arrivals area holding a sign with your name. We track your flight, so if there are delays, your driver will adjust accordingly. No extra charges for flight delays.',
    },
    {
      question: locale === 'es' ? '¿Cuál es su política de cancelación?' : 'What is your cancellation policy?',
      answer: locale === 'es'
        ? 'Cancelación gratuita hasta 24 horas antes de su actividad programada. Las cancelaciones dentro de las 24 horas o las ausencias no son reembolsables. Las cancelaciones relacionadas con el clima son completamente reembolsables.'
        : 'Free cancellation up to 24 hours before your scheduled activity. Cancellations within 24 hours or no-shows are non-refundable. Weather-related cancellations are fully refundable.',
    },
    {
      question: locale === 'es' ? '¿Los tours son adecuados para niños?' : 'Are tours suitable for children?',
      answer: locale === 'es'
        ? 'La mayoría de nuestros tours son familiares. Sin embargo, algunas actividades como tirolesa tienen restricciones de edad y peso. Consulte los requisitos específicos de cada tour o contáctenos para recomendaciones.'
        : 'Most of our tours are family-friendly. However, some activities like zip-lining have age and weight restrictions. Check the specific tour requirements or contact us for recommendations.',
    },
    {
      question: locale === 'es' ? '¿Ofrecen tours privados?' : 'Do you offer private tours?',
      answer: locale === 'es'
        ? '¡Sí! Podemos organizar tours privados para individuos, familias o grupos. Contáctenos para itinerarios personalizados y precios.'
        : 'Yes! We can arrange private tours for individuals, families, or groups. Contact us for custom itineraries and pricing.',
    },
    {
      question: locale === 'es' ? '¿Qué debo llevar en un tour?' : 'What should I bring on a tour?',
      answer: locale === 'es'
        ? 'Generalmente, traiga ropa cómoda, protector solar, repelente de insectos, una cámara y efectivo para propinas y compras personales. Los requisitos específicos se enumeran en cada página de tour.'
        : 'Generally, bring comfortable clothing, sunscreen, insect repellent, a camera, and cash for tips and personal purchases. Specific requirements are listed on each tour page.',
    },
  ];

  const faqSchema = buildFAQSchema(faqData);
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'es' ? 'Preguntas Frecuentes' : 'FAQ', url: `${baseUrl}/${locale}/faq` },
  ]);

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumb} />
      <FAQClient />
    </>
  );
}
