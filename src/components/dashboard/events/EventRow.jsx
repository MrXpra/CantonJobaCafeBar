import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';
import { deleteEvent } from '../../../services/eventService';

function EventRow({ event, onDelete }) {
  const toast = useToast();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await deleteEvent(event.id);
        toast.showSuccess('Evento eliminado exitosamente');
        if (onDelete) onDelete();
      } catch (error) {
        toast.showError('Error al eliminar el evento');
      }
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{event.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDate(event.event_datetime)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{event.location}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500 truncate max-w-xs">
          {event.description}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Link to={`/dashboard/events/edit/${event.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-5 w-5" />
            </motion.button>
          </Link>
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

export default EventRow;