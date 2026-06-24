import { supabase } from "../lib/supabase";

/* ========================================
   GET ALL USERS
======================================== */
export async function getAllUsers() {
  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
}

/* ========================================
   GET SINGLE USER
======================================== */
export async function getUserById(
  id
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
}

/* ========================================
   UPDATE USER ROLE
======================================== */
export async function updateUserRole(
  userId,
  role
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        role,
      })
      .eq("id", userId)
      .select()
      .single();

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
}

/* ========================================
   UPDATE USER PROFILE
======================================== */
export async function updateUserProfile(
  userId,
  profileData
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        full_name:
          profileData.full_name,

        avatar_url:
          profileData.avatar_url,
      })
      .eq("id", userId)
      .select()
      .single();

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
}

/* ========================================
   DELETE USER
======================================== */
export async function deleteUserProfile(
  userId
) {
  const { error } =
    await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

  if (error) {
    console.error(error);

    throw error;
  }

  return true;
}

/* ========================================
   CREATE PROFILE
======================================== */
export async function createProfile(
  profileData
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .insert([
        {
          id: profileData.id,

          full_name:
            profileData.full_name,

          email:
            profileData.email,

          role:
            profileData.role ||
            "user",
        },
      ])
      .select()
      .single();

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
}