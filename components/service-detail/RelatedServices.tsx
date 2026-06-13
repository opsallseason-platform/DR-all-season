/**
 * RELATED SERVICES COMPONENT
 * Shows similar tours/excursions/transfers
 */

import { Service } from '@/types';
import { TourCard } from '@/components/tours/TourCard';

interface RelatedServicesProps {
  services: Service[];
  title?: string;
}

export function RelatedServices({ services, title }: RelatedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 -mx-6 px-6 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl">
      <h2 className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-8 font-light">
        {title}
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <TourCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}