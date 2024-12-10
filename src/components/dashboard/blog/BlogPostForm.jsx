import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';
import { createBlogPost, updateBlogPost, fetchBlogPost } from '../../../services/blogService';
import LoadingSpinner from '../../common/LoadingSpinner';

function BlogPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published_at: null
  });

  useEffect(() => {
    const loadBlogPost = async () => {
      if (id) {
        try {
          setLoading(true);
          const post = await fetchBlogPost(id);
          setFormData({
            title: post.title,
            content: post.content,
            published_at: post.published_at
          });
        } catch (error) {
          toast.showError('Error al cargar la publicación');
        } finally {
          setLoading(false);
        }
      }
    };

    loadBlogPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e, shouldPublish = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        published_at: shouldPublish ? new Date().toISOString() : null,
        author_id: user.id
      };

      if (id) {
        await updateBlogPost(id, postData);
        toast.showSuccess('Publicación actualizada exitosamente');
      } else {
        await createBlogPost(postData);
        toast.showSuccess('Publicación creada exitosamente');
      }

      navigate('/dashboard/blog');
    } catch (error) {
      toast.showError('Error al guardar la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {id ? 'Editar Publicación' : 'Nueva Publicación'}
        </h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {showPreview ? 'Editar' : 'Vista Previa'}
        </button>
      </div>

      {showPreview ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
          <div className="prose max-w-none">
            {formData.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/blog')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              Guardar como Borrador
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleSubmit(e, true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Publicar
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}

export default BlogPostForm;