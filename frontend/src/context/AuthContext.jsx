import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('access', token);
      console.log(`Token guardado: ${token}`)
    } else {
      localStorage.removeItem('access');
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUserData(null)
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    console.log(`Token removido: ${localStorage.getItem('access')}`)
  };

  const setUser = (user) => {
    setUserData(user)
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout, userData, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
