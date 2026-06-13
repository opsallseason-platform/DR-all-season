'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export function LocaleProvider({ 
  children, 
  locale, 
  dictionary 
}: { 
  children: ReactNode; 
  locale: string; 
  dictionary: any; 
}) {
  const [messages, setMessages] = useState(dictionary);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}