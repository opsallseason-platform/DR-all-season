'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Service, filterServices, sortServices, SortOption } from '@/lib/data/services';
import { SearchBar } from '@/components/tours/SearchBar';
import { TourFilters } from '@/components/tours/TourFilters';
import { TourCard } from '@/components/tours/TourCard';
import { Button } from '@/components/ui/Button';
import { motion, useInView } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

interface ToursClientProps {
  initialServices: Service[];
}

export function ToursClient({ initialServices }: ToursClientProps) {
  const t = useTranslations('Tours');
  const locale = useLocale();
  const [services, setServices] = useState(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tour' | 'excursion'>('all');
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const refreshServices = useCallback(async () => {
    try {
      const response = await fetch(`/api/services?locale=${locale}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data.filter((service) => service.category === 'tour' || service.category === 'excursion'));
      }
    } catch {
      // Keep the last successful service list visible.
    }
  }, [locale]);

  useEffect(() => {
    const interval = window.setInterval(refreshServices, 15000);
    const refreshOnFocus = () => refreshServices();

    window.addEventListener('focus', refreshOnFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [refreshServices]);

  const filteredAndSorted = useMemo(() => {
    let filtered = filterServices(services, {
      category: categoryFilter,
      search: searchQuery,
    });

    if (priceRanges.length > 0) {
      filtered = filtered.filter((service) => {
        return priceRanges.some((range) => {
          if (range === '0-50') return service.price <= 50;
          if (range === '51-100') return service.price >= 51 && service.price <= 100;
          if (range === '101-150') return service.price >= 101 && service.price <= 150;
          if (range === '150+') return service.price > 150;
          return false;
        });
      });
    }

    return sortServices(filtered, sortBy);
  }, [services, searchQuery, sortBy, categoryFilter, priceRanges]);

  const visibleServices = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  return (
    <div ref={ref} className="relative container mx-auto px-6 py-16 z-10">
      <motion.div
        className="bg-white/10 backdrop-blur-lg p-8 border border-white/20 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortBy}
          onSortChange={(option) => setSortBy(option as SortOption)}
        />
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-12 mt-8">
        <motion.aside 
          className="lg:col-span-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TourFilters
            selectedCategory={categoryFilter}
            onCategoryChange={(cat) => setCategoryFilter(cat as 'all' | 'tour' | 'excursion')}
            selectedPriceRanges={priceRanges}
            onPriceRangeToggle={(range) => {
              setPriceRanges((prev) =>
                prev.includes(range)
                  ? prev.filter((r) => r !== range)
                  : [...prev, range]
              );
            }}
            onClearFilters={() => {
              setCategoryFilter('all');
              setPriceRanges([]);
              setSearchQuery('');
            }}
          />
        </motion.aside>

        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-8">
            <p className="text-white font-light">
              {t('showing')} {visibleServices.length} {t('of')} {filteredAndSorted.length} {t('experiences')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <TourCard service={service} />
              </motion.div>
            ))}
          </div>

          {visibleServices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white text-lg font-light">{t('noResults')}</p>
            </div>
          )}

          {hasMore && (
            <div className="mt-16 text-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-2xl px-12 py-4 font-normal tracking-wide"
                >
                  {t('loadMore')}
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
