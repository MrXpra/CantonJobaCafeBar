import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import MenuFilters from './MenuFilters';
import MenuItem from './MenuItem';
import LoadingSpinner from '../common/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/solid';

function MenuList() {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    dietary: [],
    availability: 'all'
  });

  const { data: menuItems, loading, error } = useSupabaseQuery('menu_items', {
    select: `
      *,
      category:categories(id, name)
    `,
    filters: {
      ...(filters.category && { category_id: filters.category }),
      ...(filters.availability !== 'all' && { is_available: filters.availability === 'available' })
    },
    search: filters.search ? ['name', 'description'] : null,
    searchTerm: filters.search,
    order: { column: 'name' },
    realtime: true
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error cargando el menú</div>;

  const filteredItems = menuItems?.filter(item => 
    filters.dietary.length === 0 || 
    filters.dietary.every(tag => item.dietary_tags?.includes(tag))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Menú</h2>
        <Link to="/dashboard/menu/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Platillo
          </motion.button>
        </Link>
      </div>

      <MenuFilters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron platillos que coincidan con los filtros.</p>
        </div>
      )}
    </div>
  );
}

export default MenuList;