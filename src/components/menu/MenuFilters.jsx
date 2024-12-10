import React from 'react';
import { motion } from 'framer-motion';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'vegan', label: 'Vegano' },
  { value: 'gluten-free', label: 'Sin Gluten' },
  { value: 'dairy-free', label: 'Sin Lácteos' }
];

function MenuFilters({ filters, setFilters }) {
  const { data: categories } = useSupabaseQuery('categories', {
    select: 'id, name',
    order: { column: 'name' }
  });

  const handleDietaryChange = (value) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(value)
        ? prev.dietary.filter(v => v !== value)
        : [...prev.dietary, value]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Buscar platillos..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
        >
          <option value="">Todas las categorías</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.availability}
          onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
        >
          <option value="all">Todos los platillos</option>
          <option value="available">Disponibles</option>
          <option value="unavailable">No disponibles</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map(({ value, label }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDietaryChange(value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              filters.dietary.includes(value)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default MenuFilters;