import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate } from '../lib/utils';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.event_datetime);
  const time = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
      <div className="p-6">
        <div className="flex items-center gap-2 text-orange-600 mb-4">
          <Calendar className="w-5 h-5" />
          <time dateTime={event.event_datetime} className="text-sm font-medium">
            {formatDate(event.event_datetime)}
          </time>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-orange-100 text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-orange-200 transition-colors">
          Learn More
        </button>
      </div>
    </article>
  );
}