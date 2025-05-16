// src/services/axiosConfig.js mejorado
import axios from 'axios';
import { toast } from 'react-toastify'; // Recomiendo usar esta librería para notificaciones

const API_URL = 'https://backend-stockplus.onrender.com';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    
    if (token) {
      config.headers['Authorization'] = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si no hay respuesta del servidor
    if (!error.response) {
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      return Promise.reject(error);
    }

    // Manejar errores específicos por código de estado HTTP
    switch (error.response.status) {
      case 401: // No autorizado
        localStorage.removeItem('token');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('user');
        
        // Solo redirigir si no estamos ya en la página de login
        if (!window.location.pathname.includes('/login')) {
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          window.location.href = '/login';
        }
        break;
        
      case 403: // Prohibido - No tiene permisos
        toast.error('No tienes permiso para realizar esta acción.');
        
        // Opcional: Redirigir a una página de "acceso denegado"
        // window.location.href = '/unauthorized';
        break;
        
      case 404: // No encontrado
        // No mostrar toast para cada 404, solo para operaciones específicas
        if (error.config.showErrorToast !== false) {
          toast.error('El recurso solicitado no existe.');
        }
        break;
        
      case 422: // Error de validación (Unprocessable Entity)
        // Mostrar errores de validación si están disponibles
        if (error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          errorMessages.forEach(msg => toast.error(msg));
        } else {
          toast.error(error.response.data.msg || 'Error de validación en el formulario.');
        }
        break;
        
      case 500: // Error interno del servidor
        toast.error('Error en el servidor. Por favor, inténtalo más tarde.');
        break;
        
      default:
        // Solo mostrar errores para operaciones que lo requieran
        if (error.config.showErrorToast !== false) {
          toast.error(error.response.data.msg || 'Ha ocurrido un error.');
        }
        break;
    }
    
    return Promise.reject(error);
  }
);

// Método para controlar mensajes de error en peticiones específicas
api.silentRequest = (config) => {
  return api({
    ...config,
    showErrorToast: false
  });
};

export default api;