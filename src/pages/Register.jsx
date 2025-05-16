import React, { useState } from 'react' 
import '../styles/Login.css' 
import { FaArrowLeft, FaUser, FaLock, FaPhone, FaAddressCard, FaVoicemail} from "react-icons/fa"; 
import useNavigationHelpers from '../lib/helpers/navigationHelpers'; 
import {registrarUsuario} from '../services/authService'

export const RegisterForm = () => {
  const {loginForm, landingPage} = useNavigationHelpers()
  
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    direccion: '',
    email: '',
    contraseña: '',
    rol: '67eb3d6572640c3250e0e0ed',
  })
  
  const [errors, setErrors] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    direccion: '',
    email: '',
    contraseña: '',
    general: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error específico del campo al escribir
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ''})
    }
    // También limpiar el error general si existe
    if (errors.general) {
      setErrors({...errors, general: ''})
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);
    
    try {
      const data = await registrarUsuario(formData);
      console.log("Respuesta del servidor:", data);
      
      if (data.success && (!data.errores || data.errores.length === 0)) {
        console.log("Usuario registrado correctamente:", data);
        setSuccess(true);
        setTimeout(() => {
          loginForm();
        }, 1500);
      } else {
        console.error("Error en la respuesta:", data.errores);
        const newErrors = {};
        
        // Manejar errores de validación del servidor
        if (data.errores && Array.isArray(data.errores)) {
          data.errores.forEach(err => {
            newErrors[err.path] = err.msg; // Guardar error por campo
          });
        }
        
        // Manejar específicamente el error de email existente
        if (data.msg && data.msg.includes('ya está registrado')) {
          newErrors.email = 'Este correo electrónico ya está registrado';
        } else if (data.msg) {
          newErrors.general = data.msg;
        }
        
        setErrors(newErrors);
      }
    } catch (err) {
      console.error("⚠️ Error en la solicitud:", err);
      setErrors({ general: err.message || "Error en la solicitud" });
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
          <h1>Registro</h1>
          <div className='input-box'>
            <input 
              type="text" 
              name="nombre" 
              placeholder='Nombre y Apellido' 
              value={formData.nombre} 
              onChange={handleChange}
              className={errors.nombre ? 'error-input' : ''}
              />
            <FaUser className='icon'/>
          </div>
          {errors.nombre && <p className="field-error-msg">{errors.nombre}</p>}
          
          <div className='input-box'>
            <input 
              type="number" 
              name="documento" 
              placeholder='Documento' 
              value={formData.documento} 
              onChange={handleChange}
              className={errors.documento ? 'error-input' : ''}
              />
            <FaPhone className='icon'/>
          </div>
          {errors.documento && <p className="field-error-msg">{errors.documento}</p>}

          <div className='input-box'>
            <input 
              type="number" 
              name="telefono" 
              placeholder='Telefono' 
              value={formData.telefono} 
              onChange={handleChange}
              className={errors.telefono ? 'error-input' : ''}
              />
            <FaPhone className='icon'/>
          </div>
          {errors.telefono && <p className="field-error-msg">{errors.telefono}</p>}


          
          <div className='input-box'>
            <input 
              type="text" 
              name="direccion" 
              placeholder='Direccion' 
              value={formData.direccion} 
              onChange={handleChange}
              className={errors.direccion ? 'error-input' : ''}
              />
            <FaAddressCard className='icon'/>
          </div>
          {errors.direccion && <p className="field-error-msg">{errors.direccion}</p>}
          
          <div className='input-box'>
            <input 
              type="email" 
              name="email" 
              placeholder='Email' 
              value={formData.email} 
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
              />
            <FaVoicemail className='icon'/>
          </div>
          {errors.email && <p className="field-error-msg">{errors.email}</p>}
          
          <div className='input-box'>
            <input 
              type="password" 
              name="contraseña" 
              placeholder='Contraseña' 
              value={formData.contraseña} 
              onChange={handleChange}
              className={errors.contraseña ? 'error-input' : ''}
              />
            <FaLock className='icon'/>
          </div>
          {errors.contraseña && <p className="field-error-msg">{errors.contraseña}</p>}
          {/* Mensaje de éxito */}
          {success && (
            <div className="success-msg">
              ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
          )}
          
          {/* Error general */}
          {errors.general && <div className="general-error-msg">{errors.general}</div>}
          
          <button type='submit' disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          
          <div className="register-link">
            <p>¿Ya tienes una cuenta? <a onClick={loginForm}>Iniciar Sesión</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}