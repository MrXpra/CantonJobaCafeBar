import { supabase } from '../config/supabase';

export const fetchReservation = async (id) => {
  const { data, error } = await supabase
    .from('v_reservations_with_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateReservationStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Create notification for the user
  await supabase.from('notifications').insert([{
    user_id: data.user_id,
    type: 'reservacion',
    message: `Tu reservación ha sido ${status}`
  }]);

  return data;
};

export const updateReservation = async (id, reservationData) => {
  const { data, error } = await supabase
    .from('reservations')
    .update(reservationData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteReservation = async (id) => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) throw error;
};