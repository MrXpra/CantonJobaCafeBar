import React from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';
import { deleteReservation } from '../../../services/reservationService';
import StatusBadge from '../../common/StatusBadge';

function ReservationRow({ reservation, onSelect, onUpdate }) {
  const toast = useToast();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reservación?')) {
      try {
        await deleteReservation(reservation.id);
        toast.showSuccess('Reservación eliminada exitosamente');
        onUpdate();
      } catch (error) {
        toast.showError('Error al eliminar la reservación');
      }
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {reservation.full_name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(reservation.reservation_datetime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {reservation.number_of_people}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={reservation.status} type="reservation" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(reservation)}
            className="text-gray-600 hover:text-gray-900"
          >
            <EyeIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </td>
    </tr>
  );
}

export default ReservationRow;