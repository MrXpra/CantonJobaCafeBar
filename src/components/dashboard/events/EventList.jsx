import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import EventFilters from './EventFilters';
import EventRow from './EventRow';
import LoadingSpinner from '../../common/LoadingSpinner';

function EventList() {
  const [filters, setFilters] = useState({
    search: '',
    date: ''
  });

  const { data: events, loading, error, refetch } = useSupabaseQuery('events', {
    select: '*',
    search: filters.search ? ['title', 'location'] : null,
    searchTerm: filters.search,
    filters: filters.date ? {
      event_datetime: `gte.${filters.date}T00:00:00`,
      event_datetime_end: `lt.${filters.date}T23:59:59`
    } : undefined,
    order: { column: 'event_datetime', ascending: true }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error cargando eventos</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
        <Link to="/dashboard/events/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Evento
          </motion.button>
        </Link>
      </div>

      <EventFilters filters={filters} setFilters={setFilters} />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events?.map((event) => (
              <EventRow 
                key={event.id} 
                event={event}
                onDelete={() => refetch()}
              />
            ))}
          </tbody>
        </table>

        {events?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay eventos que coincidan con los filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventList;