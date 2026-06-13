'use client';

import { useTranslations } from 'next-intl';

interface InclusionsExclusionsProps {
  inclusions: string[];
  exclusions: string[];
}

export function InclusionsExclusions({ inclusions, exclusions }: InclusionsExclusionsProps) {
  const t = useTranslations('TourDetail');

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Inclusions */}
      <div className="border-l-2 border-gray-200 pl-8">
        <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
          {t('included')}
        </h3>
        <ul className="space-y-4">
          {inclusions.map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="text-gray-900 mt-0.5 text-sm">+</span>
              <span className="text-gray-600 font-light">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Exclusions */}
      <div className="border-l-2 border-gray-200 pl-8">
        <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
          {t('notIncluded')}
        </h3>
        <ul className="space-y-4">
          {exclusions.map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="text-gray-400 mt-0.5 text-sm">-</span>
              <span className="text-gray-500 font-light">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
