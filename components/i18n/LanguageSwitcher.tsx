'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Common');

  const switchLanguage = (newLocale: string) => {
    // Extract the current path without the locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '');
    // Navigate to the new locale with the same path
    router.push(`/${newLocale}${pathWithoutLocale}`);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-slate-gray">{t('language')}:</span>
      <div className="flex space-x-1">
        <Button
          variant={locale === 'en' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => switchLanguage('en')}
          className="text-xs"
        >
          {t('english')}
        </Button>
        <Button
          variant={locale === 'es' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => switchLanguage('es')}
          className="text-xs"
        >
          {t('spanish')}
        </Button>
      </div>
    </div>
  );
}