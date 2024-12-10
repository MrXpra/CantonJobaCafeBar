import React from 'react';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';

function MenuGrid({ items, onEdit, onDelete }) {
  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay platillos disponibles en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MenuItem
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default MenuGrid;