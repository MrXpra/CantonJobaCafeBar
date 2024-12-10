import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';
import { deleteOrder } from '../../../services/orderService';
import StatusBadge from '../../common/StatusBadge';

function OrderRow({ order, onSelect, onUpdate }) {
  const toast = useToast();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      try {
        await deleteOrder(order.id);
        toast.showSuccess('Orden eliminada exitosamente');
        onUpdate();
      } catch (error) {
        toast.showError('Error al eliminar la orden');
      }
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        #{order.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {order.customer_name}
        </div>
        {order.customer_phone && (
          <div className="text-sm text-gray-500">
            {order.customer_phone}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(order.order_datetime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(order.total_price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={order.status} type="order" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(order)}
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

export default OrderRow;