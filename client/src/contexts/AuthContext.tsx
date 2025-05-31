import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, LoginCredentials, RegisterCredentials } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('myndedge-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        const authenticatedUser: User = {
          id: response.user._id,
          name: response.user.username,
          email: response.user.email
        };
        
        setUser(authenticatedUser);
        localStorage.setItem('myndedge-user', JSON.stringify(authenticatedUser));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ username, email, password });
      
      if (response.success && response.user) {
        const authenticatedUser: User = {
          id: response.user._id,
          name: response.user.username,
          email: response.user.email
        };
        
        setUser(authenticatedUser);
        localStorage.setItem('myndedge-user', JSON.stringify(authenticatedUser));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('myndedge-user');
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
