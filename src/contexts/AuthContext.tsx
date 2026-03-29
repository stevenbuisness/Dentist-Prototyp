import { createContext, useContext, ReactNode } from "react";
import { useAuth, Profile } from "../hooks/useAuth";
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  debugInfo?: {
    userId?: string;
    email?: string;
    profileRole?: string;
    hasProfile: boolean;
    error?: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, profile, loading, isAdmin, debugInfo } = useAuth();

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isAdmin, debugInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
