'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/types';

interface SelectedExcursion {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

interface ExcursionSelectorProps {
  selectedExcursions: SelectedExcursion[];
  onExcursionsChange: (excursions: SelectedExcursion[]) => void;
  className?: string;
}

export function ExcursionSelector({
  selectedExcursions,
  onExcursionsChange,
  className = '',
}: ExcursionSelectorProps) {
  const [excursions, setExcursions] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExcursions() {
      try {
        const res = await fetch('/api/services?all=true');
        const data = await res.json();
        // Filter to only tours and excursions
        const available = (Array.isArray(data) ? data : []).filter(
          (s: Service) => s.category === 'tour' || s.category === 'excursion'
        );
        setExcursions(available);
      } catch (err) {
        console.error('Error loading excursions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExcursions();
  }, []);

  const toggleExcursion = (service: Service) => {
    const exists = selectedExcursions.find((e) => e.id === service.id);
    if (exists) {
      onExcursionsChange(selectedExcursions.filter((e) => e.id !== service.id));
    } else {
      onExcursionsChange([
        ...selectedExcursions,
        {
          id: service.id,
          title: service.title,
          price: service.price,
          image: service.image,
          slug: service.slug,
        },
      ]);
    }
  };

  const isSelected = (id: string) => selectedExcursions.some((e) => e.id === id);

  if (loading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-light text-white mb-4 tracking-wide">
          Add an Excursion to Your Trip?
        </h3>
        <p className="text-sm text-white/50 font-light">Loading available excursions...</p>
      </div>
    );
  }

  if (excursions.length === 0) return null;

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-light text-white tracking-wide">
          Add an Excursion to Your Trip?
        </h3>
        <p className="text-sm text-white/50 font-light mt-1">
          Make the most of your visit — add a tour or excursion to your transfer booking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {excursions.map((excursion) => {
          const selected = isSelected(excursion.id);
          return (
            <button
              key={excursion.id}
              type="button"
              onClick={() => toggleExcursion(excursion)}
              className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                selected
                  ? 'border-blue-500/60 bg-blue-900/20 ring-1 ring-blue-500/30'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Image */}
              <img
                src={excursion.image}
                alt={excursion.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-white truncate">
                  {excursion.title}
                </p>
                {excursion.duration && (
                <p className="text-xs text-white/50 font-light mt-0.5">
                  {excursion.duration}
                </p>
                )}
                <p className="text-sm text-blue-400 font-light mt-1">
                  From ${excursion.price}/person
                </p>
              </div>

              {/* Selection indicator */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-white/30'
                }`}
              >
                {selected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {selectedExcursions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
          <p className="text-xs text-white/60 font-light uppercase tracking-wide mb-2">
            Selected Excursions ({selectedExcursions.length})
          </p>
          {selectedExcursions.map((exc) => (
            <div key={exc.id} className="flex justify-between text-sm text-white/80 font-light py-1">
              <span className="truncate mr-2">{exc.title}</span>
              <span className="text-blue-400 flex-shrink-0">+${exc.price}/person</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { SelectedExcursion };
