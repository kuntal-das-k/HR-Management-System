import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('hrms_token'));

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hrms_token');
      if (savedToken) {
        try {
          const { data } = await authService.getMe();
          setUser(data.data);
        } catch {
          localStorage.removeItem('hrms_token');
          localStorage.removeItem('hrms_user');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    const { token: newToken, user: userData } = data.data;
    localStorage.setItem('hrms_token', newToken);
    localStorage.setItem('hrms_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
