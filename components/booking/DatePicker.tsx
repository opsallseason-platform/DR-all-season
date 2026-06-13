'use client';

import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  serviceId: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({ 
  selectedDate, 
  onDateChange, 
  serviceId, 
  className = '' 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateWithoutTime = new Date(date);
    dateWithoutTime.setHours(0, 0, 0, 0);
    
    // Disable dates in the past
    return dateWithoutTime < today;
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const renderCalendar = () => {
    if (!isOpen) return null;

    // Get the first day of the month
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Get the last day of the month
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();
    
    // Create an array of days to render
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(viewYear, viewMonth, i);
      days.push(date);
    }
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={`absolute top-full left-0 mt-2 bg-gray-900 border border-white/20 rounded-2xl shadow-2xl z-50 p-6 w-80 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            &lt;
          </button>
          <h3 className="font-light text-white tracking-wide">
            {new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-light text-white/50 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-10" />;
            }
            
            const disabled = isDateDisabled(date);
            const isSelected = selectedDate && 
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
            const isToday = new Date().getDate() === date.getDate() &&
              new Date().getMonth() === date.getMonth() &&
              new Date().getFullYear() === date.getFullYear();
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => !disabled && handleDateSelect(date)}
                disabled={disabled}
                className={`
                  h-10 w-10 text-sm rounded-xl flex items-center justify-center font-light transition-all
                  ${isToday ? 'border border-blue-500/50' : ''}
                  ${isSelected 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                    : !disabled
                      ? 'hover:bg-white/10 text-white/80 hover:text-white cursor-pointer'
                      : 'text-white/20 cursor-not-allowed'
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <div className="relative">
        <input
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ''}
          placeholder="Select a date"
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer transition-all"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-white/40" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>
      
      {isOpen && renderCalendar()}
    </div>
  );
}