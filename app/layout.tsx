import { Inter, Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'DR All Season Travel | Punta Cana Excursions, Airport Transfers & Tours',
    template: '%s | DR All Season Travel',
  },
  description: 'Book Punta Cana excursions, airport transfers & tours. Pay on arrival - no upfront payment. Trusted local operator serving USA, Canada & international travelers. Call (888) 599-8728.',
  keywords: [
    'Punta Cana excursions',
    'Punta Cana airport transfer',
    'Punta Cana tours',
    'best excursions in Punta Cana',
    'Saona Island tour',
    'private transfer Punta Cana',
    'PUJ airport transfer',
    'things to do in Punta Cana',
    'pay on arrival Punta Cana',
  ],
  authors: [{ name: 'DR All Season Travel', url: 'https://drallseasontravel.com' }],
  creator: 'DR All Season Travel',
  publisher: 'DR All Season Travel',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification here
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
