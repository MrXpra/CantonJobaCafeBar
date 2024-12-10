import { supabase } from '../config/supabase';

export const fetchBlogPost = async (id) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:user_profiles(full_name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createBlogPost = async (post) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBlogPost = async (id, post) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBlogPost = async (id) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};