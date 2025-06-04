import api from "./axiosConfig";

// Login con guardado de token y permisos
const loginUsuario = async (email, contraseña) => {
  try {
    // Validación básica en el lado cliente
    if (!email || !contraseña) {
      return {
        success: false,
        msg: "Email y contraseña son obligatorios"
      };
    }

    if (contraseña.length < 6) {
      return {
        success: false,
        errorType: 'contraseña_corta',
        msg: "La contraseña debe tener al menos 6 caracteres"
      };
    }

    const response = await api.post("/auth/login", { email, contraseña });
    
    const { accessToken, tokenType, data } = response.data;
    
    if (!accessToken) {
      return {
        success: false,
        errorType: 'token_no_recibido',
        msg: "No se recibió token desde el backend."
      };
    }
    
    console.log("✅ Token recibido del backend:", accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("tokenType", tokenType || 'Bearer');
    
    // Guardar info del usuario si está disponible
    if (data) {
      console.log("✅ Guardando datos de usuario:", data);
      
      // Asegurarnos que guardamos los permisos del usuario si están disponibles
      if (!data.permisos && data.rol) {
        // Si no tenemos permisos explícitos pero sí un rol, intentamos solicitar los permisos para ese rol
        try {
          const permisosResponse = await api.get(`/roles-permisos/por-rol/${data.rol}`);
          if (permisosResponse.data && permisosResponse.data.permisos) {
            data.permisos = permisosResponse.data.permisos;
          }
        } catch (error) {
          console.warn("No se pudieron obtener permisos del rol:", error);
        }
      }
      
      localStorage.setItem("user", JSON.stringify(data));
    }
    
    return {
      ...response.data,
      success: true
    };
  } catch (error) {
    console.error("Error en login:", error);
    
    // Asegurarnos de manejar correctamente los errores
    const errorResponse = {
      success: false,
      msg: error.response?.data?.msg || "Error de conexión con el servidor"
    };
    
    // Si el backend proporciona información específica sobre el error
    if (error.response?.data?.errorType) {
      errorResponse.errorType = error.response.data.errorType;
    } else {
      errorResponse.errorType = 'error_general';
    }
    
    return errorResponse;
  }
};

// Registro SIN guardar token, solo devuelve mensaje
const registrarUsuario = async (userData) => {
  try {
    const response = await api.post("/auth/registro", userData);
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Error al registrarse"
    };
  }
};

// Cierre de sesión
const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("user");
  // Opcional: hacer una petición al backend para invalidar el token
  // return api.post('/auth/logout');
};

// Envío de correo para recuperación
const enviarTokenRecuperacion = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Error al enviar el correo"
    };
  }
};

// Reiniciar la contraseña
const resetearContraseña = async (token, nuevaContraseña) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      nuevaContraseña,
    });
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Error al cambiar la contraseña"
    };
  }
};

// Obtener el usuario actual desde localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  // Si no hay token o usuario, no está autenticado
  if (!token || !user) return false;
  
  try {
    // Verificar que el token sea válido (formato JWT)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Verificar expiración si está disponible
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      const now = Date.now() / 1000;
      if (payload.exp < now) return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    return false;
  }
};


// Obtener el token para las peticiones
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  return token ? `${tokenType} ${token}` : '';
};

// Verificar si el usuario tiene un permiso específico
// Verificar si el usuario tiene un permiso específico
const hasPermission = (permiso) => {
  const user = getCurrentUser();
  
  // Si no hay usuario, no tiene permisos
  if (!user) return false;
  
  // Si el usuario es administrador, tiene todos los permisos
  if (user && user.rol && (user.rol === 'Administrador' || user.rol.nombre === 'Administrador')) {
    return true;
  }
  
  // Buscar primero en permisos directos del usuario
  if (user.permisos && Array.isArray(user.permisos)) {
    const tienePermiso = user.permisos.some(p => 
      (typeof p === 'string' && p === permiso) || 
      (p.nombre && p.nombre === permiso)
    );
    if (tienePermiso) return true;
  }
  
  // Buscar en los permisos del rol si existe
  if (user.rol && user.rol.permisos && Array.isArray(user.rol.permisos)) {
    return user.rol.permisos.some(p => 
      (typeof p === 'string' && p === permiso) || 
      (p.nombre && p.nombre === permiso)
    );
  }
  
  return false;
};

// Verificar si el usuario tiene al menos uno de los permisos de la lista
const hasAnyPermission = (listaPermisos) => {
  if (!listaPermisos || listaPermisos.length === 0) return false;
  
  return listaPermisos.some(permiso => hasPermission(permiso));
};

// Actualizar perfil del usuario
const actualizarUsuario = async (userData) => {
  try {
    const response = await api.put("/usuarios/perfil", userData);
    
    // Actualizar datos en localStorage si la actualización fue exitosa
    if (response.data.success) {
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Error al actualizar perfil"
    };
  }
};

// Exportar todas las funciones en un objeto
const authService = {
  loginUsuario,
  registrarUsuario,
  cerrarSesion,
  enviarTokenRecuperacion,
  resetearContraseña,
  getCurrentUser,
  isAuthenticated,
  getAuthToken,
  hasPermission,
  hasAnyPermission,
  actualizarUsuario
};

export default authService;
export {
  loginUsuario,
  registrarUsuario,
  cerrarSesion,
  enviarTokenRecuperacion,
  resetearContraseña,
  getCurrentUser,
  getAuthToken,
  hasPermission,
  hasAnyPermission,
  actualizarUsuario
};