import React from 'react';
import { cn } from '../lib/utils';

export function ReservationForm() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [guests, setGuests] = React.useState('2');
  const [specialRequests, setSpecialRequests] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section id="reservations" className="py-20 bg-orange-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Make a Reservation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 rounded-md border border-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                )}
                required
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 rounded-md border border-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                )}
                required
              >
                <option value="">Select a time</option>
                {Array.from({ length: 8 }, (_, i) => i + 17).map((hour) => (
                  <option key={hour} value={`${hour}:00`}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={cn(
                "w-full px-4 py-2 rounded-md border border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              )}
              required
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
              className={cn(
                "w-full px-4 py-2 rounded-md border border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              )}
              placeholder="Any dietary restrictions or special occasions?"
            />
          </div>

          <button
            type="submit"
            className={cn(
              "w-full bg-orange-600 text-white py-3 rounded-md font-medium",
              "hover:bg-orange-700 transition-colors"
            )}
          >
            Reserve Table
          </button>
        </form>
      </div>
    </section>
  );
}