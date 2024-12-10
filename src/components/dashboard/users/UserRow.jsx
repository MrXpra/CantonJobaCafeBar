import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import StatusBadge from '../../common/StatusBadge';
import { formatDate } from '../../../utils/formatters';

function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.avatar_url ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.avatar_url}
                alt={user.full_name}
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.full_name}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={user.role} type="role" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={user.status || 'active'} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <PencilIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </td>
    </tr>
  );
}

export default UserRow;