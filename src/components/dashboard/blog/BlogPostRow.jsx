import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';
import { deleteBlogPost } from '../../../services/blogService';
import StatusBadge from '../../common/StatusBadge';
import { supabase } from '../../../config/supabase';

function BlogPostRow({ post, onDelete }) {
  const toast = useToast();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      try {
        await deleteBlogPost(post.id);
        toast.showSuccess('Publicación eliminada exitosamente');
        // Llamar al callback onDelete para actualizar la lista
        if (onDelete) {
          onDelete(post.id);
        }
      } catch (error) {
        toast.showError('Error al eliminar la publicación');
      }
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{post.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{post.author?.full_name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge 
          status={post.published_at ? 'published' : 'draft'} 
          type="blog"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(post.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Link to={`/blog/${post.id}`} target="_blank">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 hover:text-gray-900"
            >
              <EyeIcon className="h-5 w-5" />
            </motion.button>
          </Link>
          <Link to={`/dashboard/blog/edit/${post.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-5 w-5" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </td>
    </tr>
  );
}

export default BlogPostRow;