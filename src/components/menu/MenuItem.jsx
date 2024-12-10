import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import { deleteMenuItem } from '../../services/menuService';

function MenuItem({ item }) {
  const toast = useToast();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este platillo?')) {
      try {
        await deleteMenuItem(item.id);
        toast.showSuccess('Platillo eliminado exitosamente');
      } catch (error) {
        toast.showError('Error al eliminar el platillo');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category?.name}</p>
          </div>
          <p className="text-lg font-bold text-indigo-600">
            {formatCurrency(item.price)}
          </p>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.dietary_tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.is_available
              ? 'text-green-600 bg-green-100'
              : 'text-red-600 bg-red-100'
          }`}>
            {item.is_available ? 'Disponible' : 'No disponible'}
          </span>
          
          <div className="flex space-x-2">
            <Link to={`/dashboard/menu/edit/${item.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
              >
                <PencilIcon className="h-5 w-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <TrashIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MenuItem;