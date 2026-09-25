import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('ftt_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate stored token on boot
  useEffect(() => {
    const token = localStorage.getItem('ftt_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/api/auth/me')
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('ftt_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('ftt_token');
        localStorage.removeItem('ftt_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (session) => {
    if (session?.token) localStorage.setItem('ftt_token', session.token);
    if (session?.user) {
      setUser(session.user);
      localStorage.setItem('ftt_user', JSON.stringify(session.user));
    }
  };

  const register = useCallback(async (name, email, password) => {
    const data = await api.post('/api/auth/register', { name, email, password }, { auth: false });
    persist(data);
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password }, { auth: false });
    persist(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ftt_token');
    localStorage.removeItem('ftt_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
