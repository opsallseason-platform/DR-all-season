import { supabaseDb } from '@/lib/supabase/db';

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'tour' | 'excursion' | 'transfer';
  price: number; // Adult price (for backward compatibility)
  adultPrice?: number;
  childPrice?: number;
  isPerPerson?: boolean;
  childPriceEnabled?: boolean;
  hasOpenBar?: boolean;
  originalPrice?: number;
  pricingPackages?: { label: string; adultPrice: number; childPrice?: number }[];
  extraPersonPrice?: number;
  duration: string;
  image: string;
  featured: boolean;
}

/** Promo pricing overrides by slug: { slug: { price, originalPrice } } */
const PROMO_PRICING: Record<string, { price: number; originalPrice: number }> = {
  'airport-bavaro-punta-cana': { price: 18, originalPrice: 33 },
  'airport-cabeza-de-toro': { price: 18, originalPrice: 33 },
  'airport-cap-cana': { price: 18, originalPrice: 33 },
};

/** Returns true for network-level errors (DNS, timeout, connection refused) */
function isNetworkError(error: any): boolean {
  const msg = error?.message || error?.details || '';
  return msg.includes('ENOTFOUND') || msg.includes('fetch failed') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT');
}

function formatDurationHours(durationMinutes?: number): string {
  if (durationMinutes === null || durationMinutes === undefined) return '';
  if (durationMinutes === 0) return 'All Day';
  const h = Math.floor(durationMinutes / 60);
  const m = durationMinutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function mapService(service: any, locale: string = 'en'): Service {
  const pricing = service.pricing_tiers?.[0];
  const durationDisplay = formatDurationHours(service.duration_minutes);

  const useEs = locale === 'es';
  const slug = service.slug_en;
  const promo = PROMO_PRICING[slug];

  // Get child price from pricing_tiers if available
  const adultPrice = pricing ? Number(pricing.price_per_person) : 0;
  const childPrice = pricing && pricing.child_price ? Number(pricing.child_price) : (adultPrice > 0 ? Math.round(adultPrice * 0.7) : 0);

  const isPerPerson = service.is_per_person ?? service.category !== 'transfer';
  const childPriceEnabled = service.child_price_enabled ?? service.category !== 'transfer';

  // Build pricing packages if multiple tiers or tiers have labels
  const allTiers = service.pricing_tiers || [];
  const hasPackages = allTiers.length > 1 || allTiers.some((t: any) => t.label);
  const pricingPackages = hasPackages
    ? allTiers.map((t: any) => ({
        label: t.label || 'Standard',
        adultPrice: Number(t.price_per_person) || 0,
        childPrice: childPriceEnabled ? (t.child_price ? Number(t.child_price) : Math.round((Number(t.price_per_person) || 0) * 0.7)) : undefined,
      }))
    : undefined;

  return {
    id: service.id,
    title: useEs ? (service.title_es || service.title_en) : service.title_en,
    slug,
    description: useEs ? (service.description_es || service.description_en) : service.description_en,
    category: service.category,
    price: promo ? promo.price : adultPrice,
    adultPrice: promo ? promo.price : adultPrice,
    childPrice: childPriceEnabled ? (promo ? Math.round(promo.price * 0.7) : childPrice) : 0,
    isPerPerson,
    childPriceEnabled,
    hasOpenBar: service.has_open_bar ?? false,
    originalPrice: promo ? promo.originalPrice : undefined,
    pricingPackages,
    extraPersonPrice: service.extra_person_price ? Number(service.extra_person_price) : undefined,
    duration: durationDisplay,
    image: service.featured_image || '/images/excursions/Samana.png',
    featured: service.featured,
  };
}

export async function getAllServices(locale: string = 'en'): Promise<Service[]> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getAllServices:', error.message); return []; }
    throw error;
  }
  return (data || []).map((s: any) => mapService(s, locale));
}

export async function getFeaturedServices(locale: string = 'en'): Promise<Service[]> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('status', 'active')
    .eq('featured', true);

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getFeaturedServices:', error.message); return []; }
    throw error;
  }
  return (data || []).map((s: any) => mapService(s, locale));
}

export async function getServiceBySlug(slug: string, locale: string = 'en'): Promise<Service | null> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('slug_en', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getServiceBySlug:', error.message); return null; }
    throw error;
  }
  return data ? mapService(data, locale) : null;
}

export async function getToursAndExcursions(locale: string = 'en'): Promise<Service[]> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('status', 'active')
    .in('category', ['tour', 'excursion']);

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getToursAndExcursions:', error.message); return []; }
    throw error;
  }
  return (data || []).map((s: any) => mapService(s, locale));
}

export async function getTransfers(locale: string = 'en'): Promise<Service[]> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('status', 'active')
    .eq('category', 'transfer');

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getTransfers:', error.message); return []; }
    throw error;
  }
  const mapped = (data || []).map((s: any) => mapService(s, locale));
  // Sort: promo transfers first, then by price ascending
  return mapped.sort((a, b) => {
    const aPromo = a.originalPrice ? 0 : 1;
    const bPromo = b.originalPrice ? 0 : 1;
    if (aPromo !== bPromo) return aPromo - bPromo;
    return a.price - b.price;
  });
}

export async function getServicesByCategory(category: 'tour' | 'excursion' | 'transfer', locale: string = 'en'): Promise<Service[]> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('status', 'active')
    .eq('category', category);

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getServicesByCategory:', error.message); return []; }
    throw error;
  }
  return (data || []).map((s: any) => mapService(s, locale));
}

export interface ServiceFilters {
  category?: 'tour' | 'excursion' | 'transfer' | 'all';
  minPrice?: number;
  maxPrice?: number;
  duration?: string[];
  search?: string;
}

export function filterServices(services: Service[], filters: ServiceFilters): Service[] {
  let filtered = [...services];

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((s) => s.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((s) => s.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((s) => s.price <= filters.maxPrice!);
  }

  if (filters.search && filters.search.trim() !== '') {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'duration';

export function sortServices(services: Service[], sortBy: SortOption): Service[] {
  const sorted = [...services];

  switch (sortBy) {
    case 'featured':
      return sorted.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'duration':
      return sorted.sort((a, b) => a.duration.localeCompare(b.duration));
    default:
      return sorted;
  }
}

export async function getServiceDetails(slug: string, locale: string = 'en') {
  const { data, error } = await supabaseDb
    .from('services')
    .select('gallery_images, inclusions_en, inclusions_es, exclusions_en, exclusions_es, requirements_en, requirements_es, featured_image')
    .eq('slug_en', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getServiceDetails:', error.message); }
    else throw error;
  }

  if (!data) {
    return {
      galleryImages: ['/images/excursions/Samana.png'],
      itinerary: null,
      inclusions: [],
      exclusions: [],
      requirements: [],
      highlights: null,
    };
  }

  const useEs = locale === 'es';

  return {
    galleryImages: data.gallery_images?.length ? data.gallery_images : [data.featured_image || '/images/excursions/Samana.png'],
    itinerary: null,
    inclusions: useEs ? (data.inclusions_es || data.inclusions_en || []) : (data.inclusions_en || []),
    exclusions: useEs ? (data.exclusions_es || data.exclusions_en || []) : (data.exclusions_en || []),
    requirements: useEs ? (data.requirements_es || data.requirements_en || []) : (data.requirements_en || []),
    highlights: null,
  };
}

export async function getRelatedServices(
  currentServiceId: string,
  category: string,
  limit: number = 3,
  locale: string = 'en'
): Promise<Service[]> {
  const { data, error } = await supabaseDb
    .from('services')
    .select('*, pricing_tiers(*)')
    .eq('status', 'active')
    .eq('category', category)
    .neq('id', currentServiceId)
    .limit(limit);

  if (error) {
    if (isNetworkError(error)) { console.error('[DB] Network error in getRelatedServices:', error.message); return []; }
    throw error;
  }
  return (data || []).map((s: any) => mapService(s, locale));
}

export async function getServiceReviews(serviceId: string) {
  let data: any[] | null = null;
  let error: any = null;
  try {
    const res = await supabaseDb
      .from('reviews')
      .select('*, customers(first_name, last_name)')
      .eq('service_id', serviceId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5);
    data = res.data;
    error = res.error;
  } catch (e) {
    console.error('[DB] Network error in getServiceReviews:', e);
    return [];
  }

  if (error || !data || data.length === 0) {
    // Fallback: get latest reviews from any service
    try {
      const { data: fallbackData } = await supabaseDb
        .from('reviews')
        .select('*, customers(first_name, last_name)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(3);

      return (fallbackData || []).map((r: any) => ({
        id: r.id,
        name: r.customers ? `${r.customers.first_name} ${r.customers.last_name}` : 'Guest',
        country: '',
        rating: r.rating,
        comment: r.comment,
        avatar: '/images/placeholder.svg',
      }));
    } catch {
      return [];
    }
  }

  return data.map((r: any) => ({
    id: r.id,
    name: r.customers ? `${r.customers.first_name} ${r.customers.last_name}` : 'Guest',
    country: '',
    rating: r.rating,
    comment: r.comment,
    avatar: '/images/placeholder.svg',
  }));
}
