import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { redirect } from 'next/navigation';
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
  title: 'Caribbean Tours',
  description: 'Dominican Republic Tours',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Redirect to the default locale
  redirect('/en');
}