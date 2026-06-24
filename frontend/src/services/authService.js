import { supabase } from "../lib/supabase";

/* =========================
   REGISTER USER
========================= */
export async function registerUser({
  fullName,
  email,
  password,
}) {
  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const user =
    data?.user;

  if (!user) {
    throw new Error(
      "User registration failed"
    );
  }

  const {
    error:
      profileError,
  } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        full_name:
          fullName,
        email:
          user.email,
        role: "user",
      },
    ]);

  if (profileError) {
    throw profileError;
  }

  return user;
}

/* =========================
   LOGIN USER
========================= */
export async function loginUser({
  email,
  password,
}) {
  const {
    data,
    error,
  } =
    await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

  if (error) {
    throw error;
  }

  return data.user;
}

/* =========================
   LOGOUT USER
========================= */
export async function logoutUser() {
  const {
    error,
  } =
    await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}