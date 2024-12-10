import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../hooks/useToast';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

function CategoryManager() {
  const [newCategory, setNewCategory] = useState({ name: '', parent_id: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const toast = useToast();

  const { data: categories, error } = useSupabaseQuery('categories', {
    select: '*',
    order: { column: 'name' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, newCategory);
        toast.showSuccess('Categoría actualizada exitosamente');
      } else {
        await createCategory(newCategory);
        toast.showSuccess('Categoría creada exitosamente');
      }
      setNewCategory({ name: '', parent_id: null });
      setEditingCategory(null);
    } catch (error) {
      toast.showError(error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      parent_id: category.parent_id
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteCategory(id);
        toast.showSuccess('Categoría eliminada exitosamente');
      } catch (error) {
        toast.showError(error.message);
      }
    }
  };

  if (error) {
    return <div>Error al cargar las categorías</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Gestionar Categorías</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría Padre (Opcional)
            </label>
            <select
              value={newCategory.parent_id || ''}
              onChange={(e) => setNewCategory({ ...newCategory, parent_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Ninguna (Categoría Principal)</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setNewCategory({ name: '', parent_id: null });
              }}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
          </motion.button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categorías Existentes</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories?.map((category) => (
              <motion.li
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                  {category.parent_id && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Subcategoría de: {categories.find(c => c.id === category.parent_id)?.name})
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(category)}
                    className="p-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;