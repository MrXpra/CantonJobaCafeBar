import React from 'react';
import { supabase } from '../../../config/supabase';

function TopItemsTable() {
  const [topItems, setTopItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const { data: orderItems, error } = await supabase
          .from('order_items')
          .select(`
            quantity,
            price,
            menu_items (
              id,
              name
            )
          `)
          .order('quantity', { ascending: false })
          .limit(5);

        if (error) throw error;

        const processedItems = orderItems.reduce((acc, item) => {
          const existingItem = acc.find(i => i.id === item.menu_items.id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.revenue += item.quantity * item.price;
          } else {
            acc.push({
              id: item.menu_items.id,
              name: item.menu_items.name,
              quantity: item.quantity,
              revenue: item.quantity * item.price
            });
          }
          return acc;
        }, []);

        setTopItems(processedItems);
      } catch (error) {
        console.error('Error fetching top items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platillo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad Vendida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ingresos
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topItems.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${item.revenue.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopItemsTable;