import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('AuthContext: Error decoding token:', error);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  };

  const register = async (email, password) => {
    try {
      await axios.post('https://tasktrackr-61z3.onrender.com/api/auth/register', { email, password });
    } catch (error) {
      console.error('AuthContext: Register error:', error.response?.status, error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://tasktrackr-61z3.onrender.com/api/auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      if (isTokenExpired(token)) {
        throw new Error('Received expired token');
      }
      localStorage.setItem('token', token);
      setToken(token);
      const decoded = decodeToken(token);
      if (!decoded || !decoded.userId || !decoded.role) {
        throw new Error('Invalid token payload');
      }
      setUser({ id: decoded.userId, role: decoded.role });
    } catch (error) {
      console.error('AuthContext: Login error:', error.response?.status, error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        console.log('AuthContext: Token expired, logging out');
        logout();
      } else {
        const decoded = decodeToken(token);
        if (decoded && decoded.userId && decoded.role) {
          setUser({ id: decoded.userId, role: decoded.role });
        } else {
          console.log('AuthContext: Invalid token payload, logging out');
          logout();
        }
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        console.log('AuthContext: Token expired during session, logging out');
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}