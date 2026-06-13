/**
 * TRANSFER CARD COMPONENT
 * Premium animated card design for transfer services
 */

'use client';

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import {Link} from '@/i18n/routing';
import { Service } from '@/types';
import { useTranslations } from 'next-intl';

interface TransferCardProps {
  service: Service;
}

export function TransferCard({ service }: TransferCardProps) {
  const t = useTranslations('Transfers');
  return (
    <Link href={`/transfers/${service.slug}`} className="block group">
      <div className="flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-64 md:h-80 md:w-96 flex-shrink-0 overflow-hidden">
          <Image
            src={service.image}
            alt={`${service.title} - Punta Cana Airport Transfer (PUJ) | Pay on arrival with credit card or cash`}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-normal text-white mb-4">
              {service.title}
            </h3>

            <p className="text-white/90 text-base font-light leading-relaxed mb-6">
              {service.description}
            </p>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/30">
            <div className="flex flex-wrap items-baseline gap-2">
              {service.originalPrice && (
                <span className="text-xl font-light text-white/50 line-through">
                  ${service.originalPrice}
                </span>
              )}
              <span className="text-3xl sm:text-4xl font-light text-white">
                ${service.price}
              </span>
              {service.originalPrice && (
                <span className="text-xs font-medium text-green-400 uppercase tracking-wider ml-1">
                  Promo
                </span>
              )}
            </div>

            <Button 
              variant="primary" 
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-white/90 px-6 sm:px-10 py-4 rounded-2xl font-normal tracking-wide"
            >
              {t('bookTransfer')}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}