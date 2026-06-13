import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';  // Adjust path if needed (e.g., './routing' or '@/i18n/routing')

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // Fallback to default if missing or invalid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,  // <-- This is REQUIRED now
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
