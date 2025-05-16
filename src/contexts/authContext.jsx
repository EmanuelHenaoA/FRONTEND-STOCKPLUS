// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  loginUsuario, 
  registrarUsuario, 
  cerrarSesion, 
  getCurrentUser, 
  isAuthenticated 
} from '../services/authService';

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    const initAuth = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Iniciar sesión
  const login = async (email, contraseña) => {
    setLoading(true);
    const result = await loginUsuario(email, contraseña);
    if (result.success) {
      setUser(result.data);
    }
    setLoading(false);
    return result;
  };

  // Registrarse
  const register = async (userData) => {
    setLoading(true);
    const result = await registrarUsuario(userData);
    setLoading(false);
    return result;
  };

  // Cerrar sesión
  const logout = () => {
    cerrarSesion();
    setUser(null);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user || !user.rol) return false;
    return user.rol === role;
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    if (!user || !user.permisos) return false;
    return user.permisos.includes(permission);
  };

  // Verificar si el usuario tiene todos los permisos requeridos
  const hasPermissions = (requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!user || !user.permisos) return false;
    
    return requiredPermissions.every(permission => 
      user.permisos.includes(permission)
    );
  };

  // Verificar autenticación
  const authenticated = isAuthenticated();

  // Valor del contexto
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    hasPermissions,
    authenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;