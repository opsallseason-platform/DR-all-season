import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
