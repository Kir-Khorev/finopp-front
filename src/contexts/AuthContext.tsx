import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthResponse, getUser, getToken, logout as logoutApi } from '@/services/authApi';
import { identifyUser, trackEvent, FinanceEvents } from '@/services/analytics';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthResponse['user']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Загружаем данные из localStorage при монтировании
  useEffect(() => {
    const savedUser = getUser();
    const savedToken = getToken();
    
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
  }, []);

  const login = (newToken: string, newUser: AuthResponse['user']) => {
    setToken(newToken);
    setUser(newUser);
    
    // Трекинг логина (userId должен быть string!)
    identifyUser(String(newUser.id), {
      email: newUser.email,
      name: newUser.name,
    });
    trackEvent(FinanceEvents.USER_LOGGED_IN);
  };

  const logout = () => {
    trackEvent(FinanceEvents.USER_LOGGED_OUT);
    logoutApi();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


