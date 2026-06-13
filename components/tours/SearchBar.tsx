/**
 * SEARCH & SORT BAR
 * Search input and sort dropdown
 */

'use client';

import { Input } from '@/components/ui/Input';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: SearchBarProps) {
  const t = useTranslations('Tours');
  return (
    <div className="border-b border-white/30 pb-8 mb-12">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        {/* Search Input - Premium */}
        <div className="flex-1 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-white/30 focus:border-white focus:outline-none text-white placeholder-white/60 bg-transparent font-light text-lg transition-colors"
            />
            <svg 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort Dropdown - Premium */}
        <div className="w-full md:w-auto">
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full md:w-64 px-0 py-3 border-0 border-b border-white/30 focus:border-white focus:outline-none text-white bg-transparent font-light text-sm appearance-none cursor-pointer pr-8"
            >
              <option value="featured" className="bg-gray-900 text-white">{t('featured')}</option>
              <option value="price-asc" className="bg-gray-900 text-white">{t('priceLowHigh')}</option>
              <option value="price-desc" className="bg-gray-900 text-white">{t('priceHighLow')}</option>
              <option value="duration" className="bg-gray-900 text-white">{t('duration')}</option>
            </select>
            <svg 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}