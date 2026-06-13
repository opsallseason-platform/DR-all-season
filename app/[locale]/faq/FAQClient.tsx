/**
 * FAQ PAGE - CLIENT COMPONENT
 * Interactive FAQ accordion with category filtering
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full px-0 py-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-normal text-gray-900 pr-4">{item.question}</span>
        <span className="text-xl text-gray-900 flex-shrink-0 font-light">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="text-gray-600 leading-relaxed font-light">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQClient() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    { category: t('bookingPayments'), question: t('q1'), answer: t('a1') },
    { category: t('bookingPayments'), question: t('q2'), answer: t('a2') },
    { category: t('bookingPayments'), question: t('q3'), answer: t('a3') },
    { category: t('bookingPayments'), question: t('q4'), answer: t('a4') },
    { category: t('toursExcursions'), question: t('q5'), answer: t('a5') },
    { category: t('toursExcursions'), question: t('q6'), answer: t('a6') },
    { category: t('toursExcursions'), question: t('q7'), answer: t('a7') },
    { category: t('toursExcursions'), question: t('q8'), answer: t('a8') },
    { category: t('transfersCategory'), question: t('q9'), answer: t('a9') },
    { category: t('transfersCategory'), question: t('q10'), answer: t('a10') },
    { category: t('transfersCategory'), question: t('q11'), answer: t('a11') },
    { category: t('cancellationPolicy'), question: t('q12'), answer: t('a12') },
    { category: t('cancellationPolicy'), question: t('q13'), answer: t('a13') },
    { category: t('cancellationPolicy'), question: t('q14'), answer: t('a14') },
  ];

  const categories = [t('allCategories'), ...Array.from(new Set(faqs.map((faq) => faq.category)))];
  const filteredFAQs = selectedCategory === t('allCategories')
    ? faqs 
    : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div>
      <Header />

      {/* Hero Section - Premium */}
      <div className="relative h-[40vh] bg-gray-900 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center text-white max-w-3xl">
          <p className="text-sm tracking-[0.3em] uppercase mb-6 text-white/70">{t('subtitle')}</p>
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-white/80 font-light">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24">
        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-light transition-colors text-sm tracking-wide ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-2">
          {filteredFAQs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="max-w-4xl mx-auto mt-32 bg-gray-900 text-white py-20 px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            {t('stillHaveQuestions')}
          </h2>
          <p className="text-lg text-white/70 mb-12 font-light">
            {t('stillHaveQuestionsDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-gray-900 hover:bg-white/90 font-normal tracking-wide px-12 py-4 rounded-none border-none">
                {t('contactUs')}
              </Button>
            </Link>
            <a href="tel:+18885998728">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 font-light tracking-wide px-12 py-4 rounded-none">
                {t('contactUs')}
              </Button>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
