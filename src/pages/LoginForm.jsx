import React, { useState } from 'react' 
import '../styles/Login.css' 
import { FaUserCircle, FaLock, FaArrowLeft } from "react-icons/fa";
import useNavigationHelpers from '../lib/helpers/navigationHelpers';
import { loginUsuario } from '../services/authService';
import Navbar from '../components/Navbar';

export const LoginForm = () => {
  const {registerForm, landingPage, dashboardPage, forgotPasswordPage, repuestosView} = useNavigationHelpers()
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
  })
  
  const [errors, setErrors] = useState({
    email: '',
    contraseña: '',
    general: ''
  });
  const [loading, setLoading] = useState(false)
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
    // Limpiar error específico del campo al escribir
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ''})
    }
    // También limpiar el error general si existe
    if (errors.general) {
      setErrors({...errors, general: ''})
    }
  }
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validación de email
    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor, ingresa un email válido";
    }
    
    // Validación de contraseña
    if (!formData.contraseña) {
      newErrors.contraseña = "La contraseña es obligatoria";
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors({...errors, ...newErrors});
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reiniciar error general
    setErrors({...errors, general: ''});
    
    // Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await loginUsuario(formData.email, formData.contraseña);
      
      if (response.success) {
        console.log("Logueado exitosamente", response);
        // Verificar si el usuario tiene permisos administrativos
      const hasAdminPermissions = response.data && response.data.permisos && 
        response.data.permisos.some(permiso => 
          ['verRepuesto', 'verMarca', 'verCategoria', 'verRol', 'verPermiso', 'verUsuario', 'verVenta', 'verCompra'].includes(
            typeof permiso === 'string' ? permiso : permiso.nombre
          )
        );

      if (hasAdminPermissions) {
        dashboardPage(); // Usuarios administrativos van al dashboard
      } else {
        repuestosView()
        // Aquí necesitas agregar la función para ir al catálogo
        // Por ejemplo: catalogoPage(); 
        // O usar directamente window.location.href = '/repuestos-catalogo';
      }
      } else {
        // Manejar diferentes tipos de errores
        if (response.errorType === 'email_no_encontrado') {
          setErrors({...errors, email: "Este correo no está registrado en el sistema"});
        } else if (response.errorType === 'contraseña_incorrecta') {
          setErrors({...errors, contraseña: "La contraseña es incorrecta"});
        } else if (response.status === 403 || response.msg?.includes('cuenta está inactiva')) {
          // Manejar el caso de usuario inactivo
          setErrors({...errors, general: response.msg || "Tu cuenta está inactiva. Por favor contacta al administrador."});
        } else {
          setErrors({...errors, general: response.msg || "Error de autenticación"});
        }
      }
    } catch (err) {
      console.error("Error no manejado:", err);
      setErrors({...errors, general: "Error inesperado al intentar iniciar sesión"});
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='auth-container'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <FaArrowLeft onClick={landingPage} className='back'/>
          <h1 className='logo'>StockPlus</h1>
          <h1>Iniciar Sesión</h1>
          
        
          
          <div className='input-box'>
            <input
              type="email"
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
              />
            <FaUserCircle className='icon'/>
          </div>
          {errors.email && <p className="field-error-msg">{errors.email}</p>}
          
          <div className='input-box'>
            <input
              type="password"
              name='contraseña'
              placeholder='Contraseña'
              value={formData.contraseña}
              onChange={handleChange}
              className={errors.contraseña ? 'error-input' : ''}
              />
            <FaLock className='icon'/>
          </div>
          {errors.contraseña && <p className="field-error-msg">{errors.contraseña}</p>}
          {errors.general && <div className="general-error-msg">{errors.general}</div>}
          
          <button type='submit' disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
          
          <div className="register-link">
            <p>¿No tienes una cuenta? <a onClick={registerForm}>Regístrate</a></p>
            <a onClick={forgotPasswordPage}>Recupera tu contraseña</a>
          </div>
        
        </form>
      </div>
    </div>
  )
}