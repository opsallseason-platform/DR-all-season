'use client';

import { useState, useEffect } from 'react';

interface TimeSlotPickerProps {
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  serviceId: string;
  selectedDate: Date | null;
  className?: string;
}

export function TimeSlotPicker({ 
  selectedTime, 
  onTimeChange, 
  serviceId, 
  selectedDate,
  className = '' 
}: TimeSlotPickerProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available times when serviceId and selectedDate change
  useEffect(() => {
    if (serviceId && selectedDate) {
      fetchAvailableTimes();
    } else {
      setAvailableTimes([]);
    }
  }, [serviceId, selectedDate]);

  // Generate default time slots as fallback (when no schedules are configured)
  const generateDefaultTimeSlots = (): string[] => {
    const timeSlots: string[] = [];
    for (let hour = 7; hour <= 17; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return timeSlots;
  };

  const fetchAvailableTimes = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const response = await fetch(`/api/availability?serviceId=${serviceId}&date=${dateStr}`);
      const data = await response.json();
      
      if (data.success && data.availability) {
        const { availability } = data;
        
        if (availability.availableTimes && availability.availableTimes.length > 0) {
          // Use real available times from the API
          const sorted = [...availability.availableTimes].sort((a: string, b: string) => {
            const [aH, aM] = a.split(':').map(Number);
            const [bH, bM] = b.split(':').map(Number);
            return aH !== bH ? aH - bH : aM - bM;
          });
          setAvailableTimes(sorted);
        } else if (!availability.available && availability.reason) {
          // Service not available on this date (date override or past date)
          if (availability.reason.includes('No schedule')) {
            // No schedules configured - use default time slots so booking still works
            setAvailableTimes(generateDefaultTimeSlots());
          } else {
            // Date is explicitly unavailable
            setAvailableTimes([]);
            setError(availability.reason);
          }
        } else {
          // No specific times returned but service is available or fallback
          setAvailableTimes(generateDefaultTimeSlots());
        }
      } else {
        // API error or unexpected response - use fallback times
        setAvailableTimes(generateDefaultTimeSlots());
      }
    } catch (err) {
      console.error('Error fetching available times:', err);
      // Network error - use fallback times so user can still book
      setAvailableTimes(generateDefaultTimeSlots());
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    onTimeChange(time);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
        Select Time
      </label>
      
      {loading && (
        <div className="text-sm text-white/50 font-light">Loading available times...</div>
      )}
      
      {error && (
        <div className="text-sm text-red-400 mb-2 font-light">{error}</div>
      )}
      
      {!loading && availableTimes.length === 0 && !error && (
        <div className="text-sm text-white/50 font-light">No available times for selected date</div>
      )}
      
      {!loading && availableTimes.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {availableTimes.map((time) => {
            const isSelected = selectedTime === time;
            
            return (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`
                  py-3 px-4 text-sm rounded-2xl border font-light transition-all
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-500 shadow-lg'
                    : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30'
                  }
                `}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
