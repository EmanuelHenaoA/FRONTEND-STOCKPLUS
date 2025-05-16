// src/components/PermissionGuard.jsx
import React from 'react';
import { useAuth } from '../contexts/authContext';

// Componente que solo muestra su contenido si el usuario tiene los permisos necesarios
const PermissionGuard = ({ requiredPermissions, children, fallback = null }) => {
  const { hasPermissions } = useAuth();
  
  if (!requiredPermissions || hasPermissions(requiredPermissions)) {
    return <>{children}</>;
  }
  
  return fallback;
};

export default PermissionGuard;