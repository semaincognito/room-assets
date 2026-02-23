import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UserBrief } from '@/types/auth';

type AuthContextValue = {
  user: UserBrief | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (user: UserBrief) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const LS_KEY = 'app_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserBrief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
      else localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }, [user]);

  const signIn = (u: UserBrief) => setUser(u);
  const signOut = () => setUser(null);

  const value = useMemo<AuthContextValue>(() => {
    return { user, isAuthenticated: !!user, loading, signIn, signOut };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}