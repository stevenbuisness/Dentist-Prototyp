import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  role: "user" | "admin";
  status: "active" | "blocked" | "rejected";
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  address_line_1: string | null;
  post_code: string | null;
  city: string | null;
  updated_at: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Stale/invalid refresh token: clear everything and redirect to login
        if (event === "TOKEN_REFRESHED" && !session) {
          supabase.auth.signOut();
          return;
        }

        // Explicit sign-out or token invalidated
        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setProfile(null);
          setErrorMsg(undefined);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setErrorMsg(undefined);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      setLoading(true);
      setErrorMsg(undefined);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        setErrorMsg(error.message + " (" + error.code + ")");
        throw error;
      }
      setProfile(data as Profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    session,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    refreshProfile: () => user ? fetchProfile(user.id) : Promise.resolve(),
    debugInfo: {
      userId: user?.id,
      email: user?.email,
      profileRole: profile?.role,
      hasProfile: !!profile,
      error: errorMsg
    }
  };
}
