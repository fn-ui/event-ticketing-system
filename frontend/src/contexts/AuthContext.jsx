import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ========================================
     LOAD SESSION
  ======================================== */

  useEffect(() => {
    getSession();

    const {
      data:
        authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {
          const currentUser =
            session?.user ??
            null;

          setUser(
            currentUser
          );

          if (
            currentUser
          ) {
            await fetchProfile(
              currentUser.id
            );
          } else {
            setProfile(
              null
            );
          }

          setLoading(
            false
          );
        }
      );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /* ========================================
     GET CURRENT SESSION
  ======================================== */

  async function getSession() {
    try {
      setLoading(true);

      const {
        data: {
          session,
        },
        error,
      } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          error
        );

        setLoading(
          false
        );

        return;
      }

      const currentUser =
        session?.user ??
        null;

      setUser(currentUser);

      if (
        currentUser
      ) {
        await fetchProfile(
          currentUser.id
        );
      } else {
        setProfile(
          null
        );
      }
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /* ========================================
     FETCH PROFILE
  ======================================== */

  async function fetchProfile(
    userId
  ) {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error(
          error
        );

        return;
      }

      setProfile(data);
    } catch (error) {
      console.error(
        error
      );
    }
  }

  /* ========================================
     REFRESH PROFILE
  ======================================== */

  async function refreshProfile() {
    if (!user?.id)
      return;

    await fetchProfile(
      user.id
    );
  }

  /* ========================================
     LOGOUT
  ======================================== */

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);

    setProfile(null);
  }

  /* ========================================
     CONTEXT VALUE
  ======================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
        refreshProfile,

        isAuthenticated:
          !!user,

        isAdmin:
          profile?.role ===
          "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ========================================
   USE AUTH
======================================== */

export function useAuth() {
  return useContext(
    AuthContext
  );
}