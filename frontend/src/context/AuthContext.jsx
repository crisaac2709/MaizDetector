import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('access', token);
    } else {
      localStorage.removeItem('access');
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
