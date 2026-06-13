/**
 * TOUR GRID COMPONENT
 * Responsive grid layout for tour cards
 */

import { Service } from '@/types';
import { TourCard } from './TourCard';

interface TourGridProps {
  services: Service[];
}

export function TourGrid({ services }: TourGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-gray text-lg">No tours found matching your filters.</p>
        <p className="text-slate-gray text-sm mt-2">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <TourCard key={service.id} service={service} />
      ))}
    </div>
  );
}