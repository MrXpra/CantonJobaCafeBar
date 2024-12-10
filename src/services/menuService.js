import { supabase } from '../config/supabase';

export const fetchMenuItem = async (id) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createMenuItem = async (menuItem) => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([menuItem])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMenuItem = async (id, menuItem) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(menuItem)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMenuItem = async (id) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const uploadMenuItemImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `menu-items/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
};