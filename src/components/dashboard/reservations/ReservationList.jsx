import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import ReservationFilters from './ReservationFilters';
import ReservationRow from './ReservationRow';
import ReservationDetails from './ReservationDetails';
import LoadingSpinner from '../../common/LoadingSpinner';

function ReservationList() {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: '',
      end: ''
    },
    search: ''
  });
  const [selectedReservation, setSelectedReservation] = useState(null);

  const { data: reservations, loading, error, refetch } = useSupabaseQuery('v_reservations_with_profiles', {
    select: '*',
    filters: {
      ...(filters.status && { status: filters.status }),
      ...(filters.dateRange.start && {
        reservation_datetime: `gte.${filters.dateRange.start}T00:00:00`
      }),
      ...(filters.dateRange.end && {
        reservation_datetime: `lte.${filters.dateRange.end}T23:59:59`
      })
    },
    search: filters.search ? ['full_name'] : null,
    searchTerm: filters.search,
    order: { column: 'reservation_datetime', ascending: true }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error cargando reservaciones: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reservaciones</h2>
      </div>

      <ReservationFilters filters={filters} setFilters={setFilters} />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations?.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                onSelect={() => setSelectedReservation(reservation)}
                onUpdate={refetch}
              />
            ))}
          </tbody>
        </table>

        {reservations?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay reservaciones que coincidan con los filtros.</p>
          </div>
        )}
      </div>

      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}

export default ReservationList;