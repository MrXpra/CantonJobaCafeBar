import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../hooks/useToast';
import { fetchUsers, deleteUser } from '../../../services/userService';
import UserRow from './UserRow';
import UserFilters from './UserFilters';
import UserForm from './UserForm';
import LoadingSpinner from '../../common/LoadingSpinner';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';

function UsersList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  const toast = useToast();
  
  const { data: users, loading, error, refetch } = useSupabaseQuery('user_profiles', {
    select: '*',
    filters: {
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status })
    },
    search: filters.search ? ['full_name'] : null,
    searchTerm: filters.search
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUser(userId);
        toast.showSuccess('Usuario eliminado exitosamente');
        refetch();
      } catch (error) {
        toast.showError('Error al eliminar el usuario');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedUser(null);
    refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error al cargar usuarios</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Usuario
        </motion.button>
      </div>

      <UserFilters filters={filters} setFilters={setFilters} />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={() => handleEdit(user)}
                onDelete={() => handleDelete(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-medium mb-6">
              {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Dialog.Title>
            
            <UserForm
              user={selectedUser}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default UsersList;