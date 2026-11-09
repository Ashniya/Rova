import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, operatorName?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isOperator: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rova_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rova_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (err) {
          localStorage.removeItem('rova_token');
          localStorage.removeItem('rova_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: loggedInUser, token: authToken } = res.data.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('rova_token', authToken);
      localStorage.setItem('rova_user', JSON.stringify(loggedInUser));
    }
  };

  const register = async (name: string, email: string, password: string, role = 'PASSENGER', operatorName?: string) => {
    const res = await api.post('/auth/register', { name, email, password, role, operatorName });
    if (res.data.success) {
      const { user: registeredUser, token: authToken } = res.data.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('rova_token', authToken);
      localStorage.setItem('rova_user', JSON.stringify(registeredUser));
    }
  };

  const logout = () => {
    localStorage.removeItem('rova_token');
    localStorage.removeItem('rova_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isOperator: user?.role === 'OPERATOR' || user?.role === 'ADMIN',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
