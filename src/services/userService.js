import { supabase } from "../config/supabase";
import { USER_STATUS, ROLES } from "../utils/constants";

export const fetchUsers = async (filters = {}) => {
  try {
    let query = supabase.from("user_profiles").select("*");

    if (filters.search) {
      query = query.ilike("full_name", `%${filters.search}%`);
    }
    if (filters.role) {
      query = query.eq("role", filters.role);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data: users, error } = await query;

    if (error) throw error;

    // Fetch user emails in a separate query
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const emailMap = new Map(
      authUsers.users.map((user) => [user.id, user.email])
    );

    return users.map((user) => ({
      ...user,
      email: emailMap.get(user.id) || "",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName,
      },
    });

    if (error) throw error;

    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        full_name: userData.fullName,
        role: userData.role || "cliente",
        status: "active",
      })
      .eq("id", data.user.id);

    if (profileError) throw profileError;

    return data.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        full_name: userData.fullName,
        role: userData.role,
        status: userData.status,
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
