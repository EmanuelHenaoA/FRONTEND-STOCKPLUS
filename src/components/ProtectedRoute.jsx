// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; // Necesitarás crear este contexto

const ProtectedRoute = ({ requiredPermissions, children }) => {
  const { user, hasPermissions } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermissions && !hasPermissions(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
    // Alternativamente, podrías mostrar un mensaje en vez de redirigir
    // return <NoAccess message="No tienes permisos para acceder a esta sección" />;
  }
  
  return children;
};

export default ProtectedRoute;