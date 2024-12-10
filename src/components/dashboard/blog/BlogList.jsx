import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../../hooks/useToast';
import BlogFilters from './BlogFilters';
import BlogPostRow from './BlogPostRow';
import LoadingSpinner from '../../common/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';

function BlogList() {
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  const { data: posts, loading, error, refetch } = useSupabaseQuery('blog_posts', {
    select: `
      *,
      author:user_profiles(full_name)
    `,
    filters: {
      ...(filters.status && { published_at: filters.status === 'published' ? 'is.not.null' : 'is.null' })
    },
    search: filters.search ? ['title', 'content'] : null,
    searchTerm: filters.search,
    order: { column: 'created_at', ascending: false }
  });

  const handleDelete = async (postId) => {
    // Refetch the data after deletion
    await refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error cargando publicaciones</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blog</h2>
        <Link to="/dashboard/blog/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Publicación
          </motion.button>
        </Link>
      </div>

      <BlogFilters filters={filters} setFilters={setFilters} />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts?.map((post) => (
              <BlogPostRow 
                key={post.id} 
                post={post}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        {!loading && posts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay publicaciones que coincidan con los filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;