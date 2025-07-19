"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface SupabaseAuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { name?: string }
  ) => Promise<{ data: any; error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  logout: () => Promise<void>;
  updateProfile: (
    data: Partial<AuthUser>
  ) => Promise<{ success: boolean; error?: string }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(
  undefined
);

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      } else if (session) {
        setSession(session);
        await loadUserProfile(session.user);
      }

      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading profile:", error);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: profile?.full_name || authUser.user_metadata?.full_name,
        avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url,
      });
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // New auth methods for the auth modal
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { name?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user) {
        return { success: false, error: "No user logged in" };
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: data.name,
        avatar_url: data.avatar_url,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local user state
      setUser((prev) => (prev ? { ...prev, ...data } : null));
      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateProfile,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAuth must be used within a SupabaseAuthProvider"
    );
  }
  return context;
}
