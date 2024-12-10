import React, { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

function UserActions({ user, onUpdateRole, onUpdateStatus }) {
  const [showMenu, setShowMenu] = useState(false);

  const roles = ['cliente', 'personal', 'administrador'];
  const statuses = ['active', 'inactive', 'suspended'];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-gray-400 hover:text-gray-500"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {showMenu && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-500">Cambiar Rol</p>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onUpdateRole(user.id, role);
                    setShowMenu(false);
                  }}
                  className={`block w-full text-left px-2 py-1 text-sm ${
                    user.role === role
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-500">Cambiar Estado</p>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onUpdateStatus(user.id, status);
                    setShowMenu(false);
                  }}
                  className={`block w-full text-left px-2 py-1 text-sm ${
                    user.status === status
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserActions;