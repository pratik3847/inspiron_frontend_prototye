import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const DEMO_USER: User = {
  id: '1',
  name: 'Sarah Mitchell',
  email: 'sarah@ediparser.com',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const u = { ...DEMO_USER, email };
    localStorage.setItem('edi_user', JSON.stringify(u));
    setUser(u);
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const u = { id: '2', name, email };
    localStorage.setItem('edi_user', JSON.stringify(u));
    setUser(u);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edi_user');
    setUser(null);
  }, []);

  const loginAsDemo = useCallback(() => {
    localStorage.setItem('edi_user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};
