import api from "./axiosConfig";

// Login con guardado de token
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
    
    // Analizar el mensaje de error para determinar el tipo de problema
    const errorMessage = error.response?.data?.msg || "";
    
    // Si el backend proporciona información específica sobre el error
    if (error.response?.data?.errorType) {
      errorResponse.errorType = error.response.data.errorType;
    } 
    // Si no hay un tipo de error explícito, intentamos inferirlo del mensaje
    else if (errorMessage.toLowerCase().includes("no encontrado") || 
        errorMessage.toLowerCase().includes("no existe") || 
        errorMessage.toLowerCase().includes("no registrado") ||
        errorMessage.toLowerCase().includes("correo electrónico")) {
      errorResponse.errorType = 'email_no_encontrado';
      errorResponse.msg = "El correo electrónico no está registrado en el sistema";
    } else if (errorMessage.toLowerCase().includes("contraseña") || 
               errorMessage.toLowerCase().includes("credenciales") || 
               errorMessage.toLowerCase().includes("clave") || 
               errorMessage.toLowerCase().includes("incorrecta")) {
      errorResponse.errorType = 'contraseña_incorrecta';
      errorResponse.msg = "La contraseña ingresada es incorrecta";
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
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Obtener el token para las peticiones
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  return token ? `${tokenType} ${token}` : '';
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
  getAuthToken
};

export default authService;
export {
  loginUsuario,
  registrarUsuario,
  cerrarSesion,
  enviarTokenRecuperacion,
  resetearContraseña,
  getCurrentUser,
  isAuthenticated,
  getAuthToken
};