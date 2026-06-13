'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('Privacy');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-900 text-white py-24">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-normal mb-4">{t('title')}</h1>
            <p className="text-gray-400 font-light">{t('lastUpdatedDate')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-12">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section1Title')}</h2>
              <p className="text-gray-600 font-light leading-relaxed mb-4">
                {t('section1Intro')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 font-light space-y-2">
                <li>{t('section1Item1')}</li>
                <li>{t('section1Item2')}</li>
                <li>{t('section1Item3')}</li>
                <li>{t('section1Item4')}</li>
                <li>{t('section1Item5')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section2Title')}</h2>
              <p className="text-gray-600 font-light leading-relaxed mb-4">
                {t('section2Intro')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 font-light space-y-2">
                <li>{t('section2Item1')}</li>
                <li>{t('section2Item2')}</li>
                <li>{t('section2Item3')}</li>
                <li>{t('section2Item4')}</li>
                <li>{t('section2Item5')}</li>
                <li>{t('section2Item6')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section3Title')}</h2>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('section3Text')}
              </p>
            </section>

            <section className="mb-12 bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section3bTitle')}</h2>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('section3bText')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section4Title')}</h2>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('section4Text')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section5Title')}</h2>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('section5Text')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-normal mb-4 text-gray-900">{t('section6Title')}</h2>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('section6Text')}
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
