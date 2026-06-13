'use client';

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const COOKIE_CONSENT_NAME = 'dr_cookie_consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type ConsentChoice = 'accepted' | 'essential';

export function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const [isVisible, setIsVisible] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    const hasConsentChoice = document.cookie
      .split('; ')
      .some((cookie) => cookie.startsWith(`${COOKIE_CONSENT_NAME}=`));

    setIsVisible(!hasConsentChoice);
  }, []);

  const saveConsent = (choice: ConsentChoice) => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_CONSENT_NAME}=${choice}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="mx-auto max-w-3xl border border-white/15 bg-gray-950 p-5 text-white shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-blue-400" aria-hidden="true" />
          <div>
            <h2 id="cookie-consent-title" className="text-lg font-semibold">
              {t('title')}
            </h2>
            <p id="cookie-consent-description" className="mt-2 text-sm leading-6 text-gray-300">
              {t('description')}{' '}
              <Link
                href="/privacy-policy"
                className="text-blue-300 underline underline-offset-2 transition-colors hover:text-blue-200"
              >
                {t('privacyPolicy')}
              </Link>
            </p>
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 border border-white/10 bg-white/5 p-3">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(event) => setConsentChecked(event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-white/30 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950"
          />
          <span className="text-sm leading-5 text-gray-200">{t('consentLabel')}</span>
        </label>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => saveConsent('essential')}
            className="min-h-11 px-4 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            {t('essentialOnly')}
          </button>
          <button
            type="button"
            onClick={() => saveConsent('accepted')}
            disabled={!consentChecked}
            className="min-h-11 bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
