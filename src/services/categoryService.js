import { supabase } from '../config/supabase';

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const createCategory = async ({ name, parent_id = null }) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, parent_id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (id, { name, parent_id }) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ name, parent_id })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id) => {
  // First, update any menu items in this category to have no category
  await supabase
    .from('menu_items')
    .update({ category_id: null })
    .eq('category_id', id);

  // Then delete the category
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};