/**
 * FAQ PAGE
 * Frequently asked questions with accordion
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Booking & Payments
  {
    category: 'Booking & Payments',
    question: 'How do I book a tour or transfer?',
    answer: 'You can book directly through our website by clicking the "Book Now" button on any tour or transfer page. You can also contact us via phone, email, or WhatsApp for personalized assistance.',
  },
  {
    category: 'Booking & Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and cash payments. For transfers, you can pay the driver directly upon arrival.',
  },
  {
    category: 'Booking & Payments',
    question: 'Do I need to pay in advance?',
    answer: 'For tours and excursions, we require full payment at booking. For transfers, you can pay upon arrival or book with a minimum advance payment. We offer flexible payment options.',
  },
  {
    category: 'Booking & Payments',
    question: 'Are prices per person or per group?',
    answer: 'Tour and excursion prices are per person. Transfer prices are fixed for groups of 1-6 passengers, with additional charges for extra passengers.',
  },

  // Tours & Excursions
  {
    category: 'Tours & Excursions',
    question: 'What is included in the tour price?',
    answer: 'All tours include round-trip transportation, professional bilingual guides, entrance fees to attractions, and any meals specified in the itinerary. Check each tour\'s "What\'s Included" section for specifics.',
  },
  {
    category: 'Tours & Excursions',
    question: 'Are tours suitable for children?',
    answer: 'Most of our tours are family-friendly. However, some activities like zip-lining have age and weight restrictions. Check the specific tour requirements or contact us for recommendations.',
  },
  {
    category: 'Tours & Excursions',
    question: 'What should I bring on a tour?',
    answer: 'Generally, bring comfortable clothing, sunscreen, insect repellent, a camera, and cash for tips and personal purchases. Specific requirements are listed on each tour page.',
  },
  {
    category: 'Tours & Excursions',
    question: 'Do you offer private tours?',
    answer: 'Yes! We can arrange private tours for individuals, families, or groups. Contact us for custom itineraries and pricing.',
  },

  // Transfers
  {
    category: 'Transfers',
    question: 'How does airport pickup work?',
    answer: 'Your driver will meet you at the airport arrivals area holding a sign with your name. We track your flight, so if there are delays, your driver will adjust accordingly. No extra charges for flight delays.',
  },
  {
    category: 'Transfers',
    question: 'What if I have extra luggage?',
    answer: 'Our vehicles have ample space for standard luggage (2 bags per person). If you have oversized items like surfboards or golf clubs, please let us know when booking.',
  },
  {
    category: 'Transfers',
    question: 'Can I make stops during my transfer?',
    answer: 'Yes, additional stops can be arranged (grocery store, ATM, etc.) for a small extra fee. Mention this when booking or contact your driver.',
  },

  // Cancellation Policy
  {
    category: 'Cancellation Policy',
    question: 'What is your cancellation policy?',
    answer: 'Free cancellation up to 24 hours before your scheduled activity. Cancellations within 24 hours or no-shows are non-refundable. Weather-related cancellations are fully refundable.',
  },
  {
    category: 'Cancellation Policy',
    question: 'What if the weather is bad?',
    answer: 'Safety first! If weather conditions make an activity unsafe, we\'ll offer to reschedule or provide a full refund. We monitor weather closely and will notify you in advance.',
  },
  {
    category: 'Cancellation Policy',
    question: 'Can I reschedule my booking?',
    answer: 'Yes, rescheduling is free if done at least 24 hours before your original booking. Subject to availability.',
  },
];

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-light-gray rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-cloud-white transition-colors text-left"
      >
        <span className="font-semibold text-deep-navy pr-4">{item.question}</span>
        <span className="text-2xl text-caribbean-teal flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-cloud-white">
          <p className="text-slate-gray leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map((faq) => faq.category)))];
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-caribbean-teal to-sunset-coral py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about our tours, transfers, and services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-caribbean-teal text-white'
                    : 'bg-cloud-white text-slate-gray hover:bg-light-gray'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
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
        <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-caribbean-teal to-golden-sand rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our team is here to help! Contact us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-caribbean-teal hover:bg-white/90">
                Contact Us
              </Button>
            </Link>
            <a href="tel:+18885998728">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-caribbean-teal">
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}