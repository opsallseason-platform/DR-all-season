'use client';

import React from 'react';
import {Link, usePathname, useRouter} from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Nav');

  const switchLanguage = (newLocale: 'en' | 'es') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/DR_Logo.png"
              alt="D.R All Season Travel Logo"
              width={150}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="/tours"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-light tracking-wide"
            >
              {t('experiences')}
            </Link>
            <Link
              href="/transfers"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-light tracking-wide"
            >
              {t('transfers')}
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-light tracking-wide"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-light tracking-wide"
            >
              {t('contact')}
            </Link>

            {/* Language Toggle */}
            <div className="flex items-center space-x-1 text-xs border-l border-gray-200 pl-8">
              <button 
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 font-light tracking-wider ${
                  locale === 'en' 
                    ? 'text-gray-900 border-b border-gray-900' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <span className="text-gray-300">/</span>
              <button 
                onClick={() => switchLanguage('es')}
                className={`px-3 py-1 font-light tracking-wider ${
                  locale === 'es' 
                    ? 'text-gray-900 border-b border-gray-900' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                ES
              </button>
            </div>

            {/* CTA Button */}
            <Link href="/tours">
              <Button variant="primary" size="sm" className="bg-gray-900 text-white hover:bg-gray-800 rounded-2xl px-6 py-2 text-sm font-normal tracking-wide">
                {t('planTrip')}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 space-y-1 border-t border-gray-200">
            <Link
              href="/tours"
              className="block px-0 py-3 text-gray-700 hover:text-gray-900 font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('experiences')}
            </Link>
            <Link
              href="/transfers"
              className="block px-0 py-3 text-gray-700 hover:text-gray-900 font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('transfers')}
            </Link>
            <Link
              href="/about"
              className="block px-0 py-3 text-gray-700 hover:text-gray-900 font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="block px-0 py-3 text-gray-700 hover:text-gray-900 font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            
            {/* Language Toggle - Mobile */}
            <div className="flex items-center space-x-3 py-4 border-t border-gray-200 mt-4">
              <span className="text-sm text-gray-600">Language:</span>
              <button 
                onClick={() => { switchLanguage('en'); setIsMenuOpen(false); }}
                className={`px-4 py-2 text-sm font-light tracking-wider rounded-lg transition-colors ${
                  locale === 'en' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => { switchLanguage('es'); setIsMenuOpen(false); }}
                className={`px-4 py-2 text-sm font-light tracking-wider rounded-lg transition-colors ${
                  locale === 'es' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ES
              </button>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link href="/tours">
                <Button variant="primary" className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-2xl py-3 font-normal tracking-wide">
                  {t('planTrip')}
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}