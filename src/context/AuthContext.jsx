import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock users
const MOCK_USERS = [
  { id: 1, name: 'Ana Torres', email: 'ana@banca.me.com', role: 'colaborador' },
  { id: 2, name: 'Carlos Méndez', email: 'carlos@banca.me.com', role: 'admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async ({ email, password }) => {
    // Mock: cualquier contraseña funciona con emails registrados
    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) throw new Error('Usuario no encontrado');
    const userData = { ...found, token: `mock-token-${Date.now()}` };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async ({ name, email }) => {
    const newUser = { id: Date.now(), name, email, role: 'colaborador', token: `mock-token-${Date.now()}` };
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}