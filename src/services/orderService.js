import { supabase } from '../config/supabase';

export const fetchOrder = async (id) => {
  const { data, error } = await supabase
    .from('v_orders_with_profiles')
    .select(`
      *,
      items:order_items(
        id,
        quantity,
        price,
        menu_item:menu_items(id, name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Create notification for the user
  await supabase.from('notifications').insert([{
    user_id: data.user_id,
    type: 'order',
    message: `Tu orden #${id} ha sido actualizada a: ${status}`
  }]);

  return data;
};

export const deleteOrder = async (id) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) throw error;
};