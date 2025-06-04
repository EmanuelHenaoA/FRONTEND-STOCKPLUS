import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, hasPermission } from "../services/authService";

// Componente para rutas que requieren autenticación
export const ProtectedRoute = () => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  console.log("Ruta protegida - Token:", !!token);
  console.log("Ruta protegida - Usuario:", !!user);
  console.log("¿Usuario autenticado?", isAuth);
  console.log("Ruta actual:", location.pathname);
  
  return isAuth ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

// Componente para rutas que requieren permisos específicos
export const PermissionRoute = ({ permiso }) => {
  const location = useLocation();
  
  // Primero verificar autenticación
  if (!isAuthenticated()) {
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verificar permisos usando la función hasPermission del servicio de autenticación
  const tienePermiso = hasPermission(permiso);
  
  console.log(`Verificando permiso '${permiso}' - ¿Tiene permiso?:`, tienePermiso);
  
  return tienePermiso ? 
    <Outlet /> : 
    <Navigate to="/unauthorized" replace />;
};

// Componente que verifica si el usuario tiene alguno de los permisos de la lista
export const AnyPermissionRoute = ({ permisos }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const tieneAlgunPermiso = permisos.some(p => hasPermission(p));
  console.log(`Verificando alguno de los permisos [${permisos.join(', ')}] - ¿Tiene alguno?:`, tieneAlgunPermiso);
  
  if (!tieneAlgunPermiso) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};  