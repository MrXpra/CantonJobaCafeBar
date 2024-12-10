import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import OrderFilters from './OrderFilters';
import OrderRow from './OrderRow';
import OrderDetails from './OrderDetails';
import LoadingSpinner from '../../common/LoadingSpinner';

function OrderList() {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: '',
      end: ''
    },
    search: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, loading, error, refetch } = useSupabaseQuery('v_orders_with_profiles', {
    select: `
      *,
      items:order_items(
        id,
        quantity,
        price,
        menu_item:menu_items(id, name)
      )
    `,
    filters: {
      ...(filters.status && { status: filters.status }),
      ...(filters.dateRange.start && {
        order_datetime: `gte.${filters.dateRange.start}T00:00:00`
      }),
      ...(filters.dateRange.end && {
        order_datetime: `lte.${filters.dateRange.end}T23:59:59`
      })
    },
    search: filters.search ? ['full_name'] : null,
    searchTerm: filters.search,
    order: { column: 'order_datetime', ascending: false }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error cargando órdenes: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Órdenes</h2>
      </div>

      <OrderFilters filters={filters} setFilters={setFilters} />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
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
            {orders?.map((order) => (
              <OrderRow
                key={order.id}
                order={{
                  ...order,
                  customer_name: order.full_name,
                  customer_phone: order.phone_number,
                  customer_address: order.address
                }}
                onSelect={() => setSelectedOrder(order)}
                onUpdate={refetch}
              />
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay órdenes que coincidan con los filtros.</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetails
          order={{
            ...selectedOrder,
            customer_name: selectedOrder.full_name,
            customer_phone: selectedOrder.phone_number,
            customer_address: selectedOrder.address
          }}
          onClose={() => setSelectedOrder(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}

export default OrderList;