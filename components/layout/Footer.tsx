'use client';

import React from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div>
            <div className="mb-2">
              <Image 
                src="/images/DR_Logo.png" 
                alt="D.R All Season Travel" 
                width={180} 
                height={60}
              />
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed mt-0">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">{t('explore')}</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('experiences')}
                </Link>
              </li>
              <li>
                <Link href="/transfers" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('transfers')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">{t('support')}</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">{t('legal')}</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors font-light">
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">{t('getInTouch')}</h4>
            <div className="space-y-4 text-sm">
              <div>
                <a href="tel:+18885998728" className="text-gray-400 hover:text-white transition-colors font-light">
                  +1 (888) 599-8728
                </a>
              </div>
              <div>
                <a href="mailto:info@drallseasontravel.com" className="text-gray-400 hover:text-white transition-colors font-light">
                  info@drallseasontravel.com
                </a>
              </div>
              <div className="text-gray-400 font-light">
                {t('location')}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-sm font-light">
            {t('copyright')} | <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors font-light">{t('privacyPolicy')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}