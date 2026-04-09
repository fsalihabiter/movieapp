import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to hydrate user from local token
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Decode JWT payload (simple base64 decoding for user info)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (err) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser({ id: res.data._id, username: res.data.username, isAdmin: res.data.isAdmin });
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(err) {
      console.log(err);
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.href = '/home';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
