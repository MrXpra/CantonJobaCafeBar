import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import type { Event } from '../../types';

interface FeaturedEventProps {
  event: Event;
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  const eventDate = new Date(event.event_datetime);
  const time = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <article className="relative isolate flex flex-col lg:flex-row gap-8 bg-orange-50 rounded-2xl overflow-hidden">
      <div className="relative aspect-[16/9] lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      
      <div className="p-8 lg:w-1/2">
        <div className="flex items-center gap-2 text-orange-600 mb-4">
          <Calendar className="w-5 h-5" />
          <time dateTime={event.event_datetime} className="text-sm font-medium">
            {formatDate(event.event_datetime)}
          </time>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-6">
          {event.description}
        </p>

        <div className="flex flex-col gap-3 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors">
          Reserve Your Spot
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}