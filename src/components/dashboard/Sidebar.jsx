import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Panel Principal' },
    { path: '/dashboard/users', icon: '👥', label: 'Usuarios' },
    { 
      path: '/dashboard/menu',
      icon: '🍽️',
      label: 'Menú',
      subItems: [
        { path: '/dashboard/menu', label: 'Ver Menú' },
        { path: '/dashboard/menu/categories', label: 'Gestionar Categorías' }
      ]
    },
    { path: '/dashboard/orders', icon: '📝', label: 'Órdenes' },
    { path: '/dashboard/reservations', icon: '📅', label: 'Reservaciones' },
    { path: '/dashboard/blog', icon: '📰', label: 'Blog' },
    { path: '/dashboard/events', icon: '🎉', label: 'Eventos' }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Restaurant Admin
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 space-y-1">
              {menuItems.map((item) => (
                <div key={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => onClose()}
                      className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-r-4 border-purple-400'
                          : 'hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                  {item.subItems && isActive(item.path) && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => onClose()}
                          className={`block px-4 py-2 text-sm text-gray-300 rounded-lg transition-colors duration-200 ${
                            location.pathname === subItem.path
                              ? 'text-white bg-gray-700/50'
                              : 'hover:bg-gray-700/30 hover:text-white'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              © {new Date().getFullYear()} Restaurant Admin
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;