import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';
import { updateReservationStatus } from '../../../services/reservationService';
import StatusBadge from '../../common/StatusBadge';

function ReservationDetails({ reservation, onClose, onUpdate }) {
  const toast = useToast();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateReservationStatus(reservation.id, newStatus);
      toast.showSuccess('Estado de la reservación actualizado exitosamente');
      onUpdate();
    } catch (error) {
      toast.showError('Error al actualizar el estado de la reservación');
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Reservación #{reservation.id}
            </h3>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <p>Cliente: {reservation.full_name}</p>
              <p>Fecha: {formatDate(reservation.reservation_datetime)}</p>
              <p>Personas: {reservation.number_of_people}</p>
              <StatusBadge status={reservation.status} type="reservation" />
            </div>
          </div>

          {reservation.special_requests && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Solicitudes Especiales
              </h4>
              <p className="text-sm text-gray-600">{reservation.special_requests}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            {['pendiente', 'confirmada', 'cancelada'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange(status)}
                disabled={reservation.status === status}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  reservation.status === status
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ReservationDetails;