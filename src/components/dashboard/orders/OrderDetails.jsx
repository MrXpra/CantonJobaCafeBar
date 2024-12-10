import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';
import { updateOrderStatus } from '../../../services/orderService';
import { ORDER_STATUS } from '../../../utils/constants';
import StatusBadge from '../../common/StatusBadge';

function OrderDetails({ order, onClose, onUpdate }) {
  const toast = useToast();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.showSuccess('Estado de la orden actualizado exitosamente');
      onUpdate();
    } catch (error) {
      toast.showError('Error al actualizar el estado de la orden');
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

        <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6 shadow-xl">
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
              Orden #{order.id}
            </h3>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <p>Cliente: {order.customer_name}</p>
              {order.customer_phone && <p>Teléfono: {order.customer_phone}</p>}
              {order.customer_address && <p>Dirección: {order.customer_address}</p>}
              <p>Fecha: {formatDate(order.order_datetime)}</p>
              <StatusBadge status={order.status} type="order" />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Ítems de la Orden</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Ítem
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Precio
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.menu_item.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td colSpan="3" className="px-4 py-2 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(order.total_price)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {order.notes && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            {Object.values(ORDER_STATUS).map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange(status)}
                disabled={order.status === status}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  order.status === status
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default OrderDetails;