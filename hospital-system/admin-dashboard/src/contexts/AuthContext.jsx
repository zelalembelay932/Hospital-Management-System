import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');

      if (response.data.user.role === 'admin') {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('admin_token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });

    if (response.data.user.role !== 'admin') {
      throw new Error('Admin access only');
    }

    localStorage.setItem('admin_token', response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
