import React from 'react';
import { EventCard } from './EventCard';
import { FeaturedEvent } from './FeaturedEvent';
import type { Event } from '../types';

interface EventsSectionProps {
  events: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1);

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Upcoming Events</h2>

        {featuredEvent && <FeaturedEvent event={featuredEvent} />}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}