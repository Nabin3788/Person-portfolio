import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL || 'https://portfolio-backend-xpwj.onrender.com/';

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        setError('Unable to load authentication state.');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed.');
        return { success: false, error: data.error || 'Login failed.' };
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setError('Login request failed.');
      return { success: false, error: 'Login request failed.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Registration failed.');
        return { success: false, error: data.error || 'Registration failed.' };
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setError('Registration request failed.');
      return { success: false, error: 'Registration request failed.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Logout failed.');
        return { success: false, error: data.error || 'Logout failed.' };
      }

      setUser(null);
      return { success: true };
    } catch (err) {
      setError('Logout failed.');
      return { success: false, error: 'Logout failed.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
