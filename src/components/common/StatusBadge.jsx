import React from 'react';

const getStatusColor = (status, type = 'default') => {
  const colors = {
    default: {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    },
    role: {
      administrador: 'bg-red-100 text-red-800',
      personal: 'bg-blue-100 text-blue-800',
      cliente: 'bg-gray-100 text-gray-800',
    },
    blog: {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800'
    },
    order: {
      pendiente: 'bg-yellow-100 text-yellow-800',
      'en proceso': 'bg-blue-100 text-blue-800',
      completada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800'
    }
  };

  return colors[type]?.[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

function StatusBadge({ status, type = 'default' }) {
  const displayStatus = type === 'blog' && status === 'published' ? 'Publicado' : 
                       type === 'blog' && status === 'draft' ? 'Borrador' : 
                       status;

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status, type)}`}>
      {displayStatus}
    </span>
  );
}

export default StatusBadge;