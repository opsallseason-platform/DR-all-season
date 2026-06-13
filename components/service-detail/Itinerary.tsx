interface ItineraryProps {
  items: { time: string; activity: string }[];
}

export function Itinerary({ items }: ItineraryProps) {
  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={index} className="flex gap-8 pb-8 relative">
          {/* Timeline line */}
          {index < items.length - 1 && (
            <div className="absolute left-[52px] top-10 bottom-0 w-px bg-gray-200" />
          )}

          {/* Time badge */}
          <div className="flex-shrink-0 w-28 relative">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-xs tracking-wider font-light rounded-full">
              {item.time}
            </span>
            {/* Dot on timeline */}
            <div className="absolute right-[-20px] top-3 w-2 h-2 bg-gray-400 rounded-full" />
          </div>

          {/* Activity */}
          <div className="flex-1 pt-1.5">
            <p className="text-gray-600 font-light leading-relaxed">{item.activity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
