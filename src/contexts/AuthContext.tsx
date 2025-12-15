import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, getUser, getToken, logout as logoutApi } from '@/services/authApi';

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
  };

  const logout = () => {
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

