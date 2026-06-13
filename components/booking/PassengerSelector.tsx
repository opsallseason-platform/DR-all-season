'use client';

interface PassengerCounts {
  adults: number;
  children: number;
}

interface PassengerSelectorProps {
  passengerCounts?: PassengerCounts;
  selectedPassengers?: number;
  onPassengerChange: any;
  maxPassengers?: number;
  className?: string;
  showChildPrice?: boolean;
}

export function PassengerSelector(props: PassengerSelectorProps) {
  const {
    maxPassengers = 20,
    className = '',
    showChildPrice = true,
  } = props;

  const isLegacyMode = props.passengerCounts === undefined;
  const passengerCounts: PassengerCounts = props.passengerCounts ?? {
    adults: props.selectedPassengers ?? 1,
    children: 0,
  };

  const emitPassengerChange = (counts: PassengerCounts) => {
    if (isLegacyMode) {
      props.onPassengerChange(counts.adults + counts.children);
      return;
    }

    props.onPassengerChange(counts);
  };

  const enableChildSelector = showChildPrice && !isLegacyMode;
  const handleAdultIncrement = () => {
    if (passengerCounts.adults + passengerCounts.children < maxPassengers) {
      emitPassengerChange({ ...passengerCounts, adults: passengerCounts.adults + 1 });
    }
  };

  const handleAdultDecrement = () => {
    if (passengerCounts.adults > 1) {
      emitPassengerChange({ ...passengerCounts, adults: passengerCounts.adults - 1 });
    }
  };

  const handleAdultInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value + passengerCounts.children <= maxPassengers) {
      emitPassengerChange({ ...passengerCounts, adults: value });
    }
  };

  const handleChildIncrement = () => {
    if (passengerCounts.adults + passengerCounts.children < maxPassengers) {
      emitPassengerChange({ ...passengerCounts, children: passengerCounts.children + 1 });
    }
  };

  const handleChildDecrement = () => {
    if (passengerCounts.children > 0) {
      emitPassengerChange({ ...passengerCounts, children: passengerCounts.children - 1 });
    }
  };

  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && passengerCounts.adults + value <= maxPassengers) {
      emitPassengerChange({ ...passengerCounts, children: value });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Adults */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-light text-white tracking-wide uppercase">
            Adults
          </label>
          {enableChildSelector && (
            <p className="text-xs text-white/50 font-light mt-1">Age 13+</p>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center bg-white/5 border border-white/20 rounded-2xl">
            <button
              type="button"
              onClick={handleAdultDecrement}
              className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-l-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light"
              disabled={passengerCounts.adults <= 1}
            >
              -
            </button>
            
            <input
              type="number"
              min="1"
              max={maxPassengers}
              value={passengerCounts.adults}
              onChange={handleAdultInputChange}
              className="w-16 text-center bg-transparent text-white font-light py-3 focus:outline-none"
            />
            
            <button
              type="button"
              onClick={handleAdultIncrement}
              className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-r-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light"
              disabled={passengerCounts.adults + passengerCounts.children >= maxPassengers}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Children */}
      {enableChildSelector && (
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-light text-white/80 tracking-wide uppercase">
              Children
            </label>
            <p className="text-xs text-white/50 font-light mt-1">Up to 12 years old</p>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center bg-white/5 border border-white/20 rounded-2xl">
              <button
                type="button"
                onClick={handleChildDecrement}
                className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-l-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light"
                disabled={passengerCounts.children <= 0}
              >
                -
              </button>
              
              <input
                type="number"
                min="0"
                max={maxPassengers}
                value={passengerCounts.children}
                onChange={handleChildInputChange}
                className="w-16 text-center bg-transparent text-white font-light py-3 focus:outline-none"
              />
              
              <button
                type="button"
                onClick={handleChildIncrement}
                className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-r-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light"
                disabled={passengerCounts.adults + passengerCounts.children >= maxPassengers}
              >
                +
              </button>
            </div>
            
            <div className="ml-3 text-sm text-white/50 font-light">
              Max: {maxPassengers}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}