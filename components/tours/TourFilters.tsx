/**
 * TOUR FILTERS SIDEBAR
 * Filter options for category, price, duration
 */

'use client';

import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface TourFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriceRanges: string[];
  onPriceRangeToggle: (range: string) => void;
  onClearFilters: () => void;
}

export function TourFilters({
  selectedCategory,
  onCategoryChange,
  selectedPriceRanges,
  onPriceRangeToggle,
  onClearFilters,
}: TourFiltersProps) {
  const t = useTranslations('Tours');
  const categories = [
  { value: 'all', label: t('all') },
  { value: 'tour', label: t('tours') },
  { value: 'excursion', label: t('excursions') },
];

  const priceRanges = [
    { value: '0-50', label: '$0 - $50' },
    { value: '51-100', label: '$51 - $100' },
    { value: '101-150', label: '$101 - $150' },
    { value: '150+', label: '$150+' },
  ];

  return (
    <div className="p-6 sticky top-24">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm tracking-[0.3em] uppercase text-white/90">{t('filter')}</h3>
        <button onClick={onClearFilters} className="text-sm text-white/80 hover:text-white font-light">
          {t('clear')}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-8 pb-8 border-b border-white/30">
        <h4 className="font-normal text-white mb-4 text-sm">{t('category')}</h4>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={selectedCategory === cat.value}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-4 h-4 text-white focus:ring-white"
              />
              <span className="ml-3 text-white/80 group-hover:text-white font-light text-sm">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h4 className="font-normal text-white mb-4 text-sm">{t('priceRange')}</h4>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(range.value)}
                onChange={() => onPriceRangeToggle(range.value)}
                className="w-4 h-4 text-white focus:ring-white rounded-none"
              />
              <span className="ml-3 text-white/80 group-hover:text-white font-light text-sm">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}